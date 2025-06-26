import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginCredentials } from '../../types/auth';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await login(credentials);
      navigate('/'); // redireciona após login bem-sucedido
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex justify-center p-6 md:py-20'>
      <form onSubmit={handleSubmit} className='shadow-md text-black flex flex-col gap-6 md:w-1/5 rounded-xl p-8'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center'>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Insira seu email...'
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className='flex flex-col items-center'>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Insira sua senha...'
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div className='flex justify-center'>
          <button type="submit" disabled={isSubmitting}
          className='py-2 px-6 rounded cursor-pointer'>
            {isSubmitting ? 'Entrando' : 'Entrar'}
          </button>
        </div>

        <div className='pt-8 flex justify-center'>
          <p className='text-xs'>Não possui conta? <Link to="/criarconta" className='underline'>Registre-se.</Link></p>
        </div>
      </form>
    </div>
  );
};