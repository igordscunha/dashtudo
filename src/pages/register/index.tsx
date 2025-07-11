import axios from "axios";
import { useState } from "react";

export const RegisterPage = () => {

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [data_nascimento, setDatanascimento] = useState('');
  const [email, setEmail] = useState('');
  const [hash_password, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      await axios.post('https://my-server-s39h.onrender.com/users', {
        nome,
        sobrenome,
        data_nascimento,
        email,
        hash_password
      });
      setMensagem('Usuário registrado com sucesso!');
    } catch(error){
      console.log('Erro ao registrar usuário: ', error);
      setMensagem('Ocorreu um erro ao registrar o usuário.');
    }
  };


  return(
    <section className="p-5 md:w-full flex justify-center py-20">
      <form onSubmit={handleSubmit} className='text-black flex flex-col gap-6 md:w-full md:mt-20 rounded-xl p-8'>
        <div>
          <label htmlFor="nome">Nome:</label><br/>
          <input type="text" id="nome" name="nome" value={nome} required 
          onChange={(e) => setNome(e.target.value)}/><br/>
        </div>

        <div>
          <label htmlFor="sobrenome">Sobrenome:</label><br/>
          <input type="text" id="sobrenome" name="sobrenome" value={sobrenome} required
          onChange={(e) => setSobrenome(e.target.value)}/><br/>
        </div>

        <div>
          <label htmlFor="datanascimento">Data de Nascimento:</label><br/>
          <input type="date" id="datanascimento" name="datanascimento" value={data_nascimento} required
          onChange={(e) => setDatanascimento(e.target.value)}/><br/>
        </div>

        <div>
          <label htmlFor="email">Email:</label><br/>
          <input type="email" id="email" name="email" value={email} required
          onChange={(e) => setEmail(e.target.value)}/><br/>
        </div>

        <div>
          <label htmlFor="senha">Senha:</label><br/>
          <input type="password" id="senha" name="senha" value={hash_password} minLength={6} required
          onChange={(e) => setSenha(e.target.value)}/><br/>
        </div>

        <div className="flex justify-center">
          <button type="submit" className='border border-black py-2 px-6 rounded cursor-pointer'>Cadastrar</button>
        </div>

        {mensagem && <p>{mensagem}</p>}
      </form>
    </section>
  )
}