import React, { useState, useCallback } from 'react';
import { FiUpload, FiFileText, FiBarChart, FiPieChart, FiTrendingUp, FiDownload, FiSettings, FiEye, FiEdit3 } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

interface DataRow {
  [key: string]: string | number;
}

interface SelectedColumns {
  x: string;
  y: string;
}

interface ChartConfig {
  title: string;
  colors: string[];
}

interface ColumnNames {
  [columnName: string]: string;
}

interface ParsedData {
  headers: string[];
  data: DataRow[];
}

const ChartVisualizer: React.FC = () => {
  const [csvData, setCsvData] = useState<DataRow[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>({ x: '', y: '' });
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    title: 'Meu Gráfico',
    colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316']
  });
  const [isEditingColumns, setIsEditingColumns] = useState<boolean>(false);
  const [columnNames, setColumnNames] = useState<ColumnNames>({});

  const parseCSV = useCallback((text: string): ParsedData => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], data: [] };
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: DataRow[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: DataRow = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        row[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return row;
    });
    
    return { headers, data };
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      const { headers, data } = parseCSV(text);
      
      setCsvData(data);
      setColumns(headers);
      
      // Inicializar nomes das colunas
      const initialNames: ColumnNames = {};
      headers.forEach(header => {
        initialNames[header] = header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      });
      setColumnNames(initialNames);
      
      // Auto-selecionar colunas se possível
      if (headers.length >= 2) {
        setSelectedColumns({ x: headers[0], y: headers[1] });
      }
    };
    reader.readAsText(file);
  }, [parseCSV]);

  const getChartData = () => {
    if (!csvData || !selectedColumns.x || !selectedColumns.y) return null;

    const aggregatedData: { [key: string]: number } = {};
    csvData.forEach(row => {
      const xValue = String(row[selectedColumns.x]);
      const yValue = Number(row[selectedColumns.y]) || 0;
      
      if (aggregatedData[xValue]) {
        aggregatedData[xValue] += yValue;
      } else {
        aggregatedData[xValue] = yValue;
      }
    });

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);

    return {
      labels,
      datasets: [{
        label: columnNames[selectedColumns.y] || selectedColumns.y,
        data,
        backgroundColor: chartType === 'pie' 
          ? chartConfig.colors.slice(0, labels.length)
          : chartConfig.colors[0],
        borderColor: chartType === 'line' ? chartConfig.colors[0] : undefined,
        borderWidth: chartType === 'line' ? 2 : 1,
        fill: chartType === 'line' ? false : undefined
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: chartConfig.title,
        font: { size: 16, weight: 'bold' as const }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            return `${label}: ${context.parsed.y || context.parsed}`;
          }
        }
      }
    },
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: columnNames[selectedColumns.y] || selectedColumns.y
        }
      },
      x: {
        title: {
          display: true,
          text: columnNames[selectedColumns.x] || selectedColumns.x
        }
      }
    } : {}
  };

  const renderChart = () => {
    const data = getChartData();
    if (!data) return null;

    switch (chartType) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      default:
        return <Bar data={data} options={chartOptions} />;
    }
  };

  const getDataInsights = (): string[] => {
    if (!csvData || csvData.length === 0) return [];
    
    const insights: string[] = [];
    const numericColumns = columns.filter(col => 
      csvData.some(row => typeof row[col] === 'number')
    );
    
    insights.push(`📊 Dataset contém ${csvData.length} registros`);
    insights.push(`📈 ${numericColumns.length} colunas numéricas identificadas`);
    
    if (selectedColumns.y && numericColumns.includes(selectedColumns.y)) {
      const values = csvData.map(row => row[selectedColumns.y]).filter((v): v is number => typeof v === 'number');
      const total = values.reduce((sum, val) => sum + val, 0);
      const avg = total / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      insights.push(`💰 Soma total: ${total.toLocaleString('pt-BR')}`);
      insights.push(`📊 Média: ${avg.toFixed(2)}`);
      insights.push(`📈 Maior valor: ${max.toLocaleString('pt-BR')}`);
      insights.push(`📉 Menor valor: ${min.toLocaleString('pt-BR')}`);
    }
    
    return insights;
  };

  const exportChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${chartConfig.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 md:p-20 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Chart Visualizer</h1>
          <p className="text-gray-600">Transforme seus dados em insights visuais</p>
        </div>

        {/* Upload Section */}
        {!csvData && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <FiUpload className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Faça upload do seu arquivo CSV
              </h3>
              <p className="text-gray-500 mb-4">
                Arraste e solte ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2"
              >
                <FiFileText size={16} />
                Selecionar Arquivo
              </label>
            </div>
          </div>
        )}

        {csvData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Column Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiSettings size={18} />
                    Configurações
                  </h3>
                  <button
                    onClick={() => setIsEditingColumns(!isEditingColumns)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                  >
                    <FiEdit3 size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Gráfico
                    </label>
                    <input
                      type="text"
                      value={chartConfig.title}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Gráfico
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'bar' as const, icon: FiBarChart, label: 'Barras' },
                        { type: 'pie' as const, icon: FiPieChart, label: 'Pizza' },
                        { type: 'line' as const, icon: FiTrendingUp, label: 'Linha' }
                      ].map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => setChartType(type)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            chartType === type
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={20} className="mx-auto mb-1" />
                          <div className="text-xs">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eixo X (Categorias)
                    </label>
                    <select
                      value={selectedColumns.x}
                      onChange={(e) => setSelectedColumns(prev => ({ ...prev, x: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      {columns.map(col => (
                        <option key={col} value={col}>
                          {columnNames[col] || col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eixo Y (Valores)
                    </label>
                    <select
                      value={selectedColumns.y}
                      onChange={(e) => setSelectedColumns(prev => ({ ...prev, y: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione...</option>
                      {columns.filter(col => 
                        csvData.some(row => typeof row[col] === 'number')
                      ).map(col => (
                        <option key={col} value={col}>
                          {columnNames[col] || col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Column Name Editor */}
              {isEditingColumns && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Editar Nomes das Colunas</h3>
                  <div className="space-y-3">
                    {columns.map(col => (
                      <div key={col}>
                        <label className="block text-xs text-gray-500 mb-1">
                          {col}
                        </label>
                        <input
                          type="text"
                          value={columnNames[col] || col}
                          onChange={(e) => setColumnNames(prev => ({ ...prev, [col]: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiEye size={18} />
                  Insights dos Dados
                </h3>
                <div className="space-y-2">
                  {getDataInsights().map((insight, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Display */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Visualização
                  </h3>
                  <button
                    onClick={exportChart}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FiDownload size={16} />
                    Exportar
                  </button>
                </div>
                
                <div className="h-96">
                  {renderChart()}
                </div>
              </div>

              {/* Data Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Preview dos Dados</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {columns.slice(0, 5).map(col => (
                          <th key={col} className="text-left py-2 px-3 font-medium text-gray-700">
                            {columnNames[col] || col}
                          </th>
                        ))}
                        {columns.length > 5 && <th className="text-left py-2 px-3">...</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          {columns.slice(0, 5).map(col => (
                            <td key={col} className="py-2 px-3 text-gray-600">
                              {String(row[col]).substring(0, 50)}
                              {String(row[col]).length > 50 && '...'}
                            </td>
                          ))}
                          {columns.length > 5 && <td className="py-2 px-3">...</td>}
                        </tr>
                      ))}
                      {csvData.length > 5 && (
                        <tr>
                          <td colSpan={Math.min(columns.length, 6)} className="py-2 px-3 text-center text-gray-500">
                            ... e mais {csvData.length - 5} registros
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartVisualizer;