export const Home = () => {

  return(
    <section className="p-6 md:my-24">
      <div className="flex flex-col md:flex-row items-start">
        <div className="space-y-4">
          <h4>Ferramentas e recursos do DashTudo</h4>
          <h1>Insira dados, tenha gráficos essenciais e receba insights automáticos gerados pelas melhores IA's.</h1>
          <p className="text-[#4f4d52]">O DashTudo permite a inserção de dados manualmente, por arquivos .csv e .pdf, a classificação por categorias e insights automáticos.</p>
        </div>
        
        <div>
          <img src='dashtudo3-nobg.png' className="md:w-3xl"/>
        </div>
      </div>
    </section>
  )
}