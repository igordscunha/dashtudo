import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [data_nascimento, setDatanascimento] = useState('');
  const [email, setEmail] = useState('');
  const [hash_password, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [editar, setEditar] = useState(false);
  const [nascimentoEditado, setNascimentoEditado] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      await axios.put(baseUrl + 'v1/users/' + user?.id, {
        nome,
        sobrenome,
        data_nascimento,
        email,
        hash_password
      })
      setMensagem('Usuário editado com sucesso.')
      navigate('/profile')
    }
    catch(error){
      // console.log('Erro ao editar usuário: ', error) !### DEV
      setMensagem('Erro ao editar usuário')
    }
  }

  useLayoutEffect(() => {
    try{
      if(user){
        const dataNascimentoEditada = user?.data_nascimento.toString().split('T')[0];
        setNascimentoEditado(dataNascimentoEditada)
      }
    }catch{
      setNascimentoEditado("31/12/2000")
    }
  }, [user])

  return(
    <section className="p-6 md:mt-8">
      <p className="pb-14 text-3xl">Meu Perfil</p>
      <div>
        {editar ? (
          <form className="!border-0" onSubmit={handleSubmit}>
            <label htmlFor="nome">Nome:</label>
            <input type="text" name="nome" placeholder="Insira seu nome..." required value={nome} onChange={(e) => setNome(e?.target.value)}/>
            <label htmlFor="sobrenome">Sobrenome:</label>
            <input type="text" name="sobrenome" placeholder="Insira seu sobrenome..." required value={sobrenome} onChange={(e) => setSobrenome(e?.target.value)}/>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" placeholder="Insira seu email..." required value={email} onChange={(e) => setEmail(e?.target.value)}/>
            <label htmlFor="datanascimento">Data de Nascimento:</label>
            <input type="date" name="datanascimento" required value={data_nascimento} onChange={(e) => setDatanascimento(e?.target.value)}/>
            <label htmlFor="senha">Senha:</label>
            <input type="password" name="senha" placeholder="Insira sua senha..." required value={hash_password} minLength={6} onChange={(e) => setSenha(e?.target.value)}/>
            <button type="submit" className="p-2 px-4 rounded md:mt-4">Editar</button>

            {mensagem && <p className="italic w-full flex justify-center py-12">{mensagem}</p>}
          </form>

        ): (
          <div>
            <form className="!border-0">
              <label htmlFor="nome">Nome:</label>
              <input type="text" name="nome" defaultValue={user?.nome} readOnly/>
              <label htmlFor="sobrenome">Sobrenome:</label>
              <input type="text" name="sobrenome" defaultValue={user?.sobrenome} readOnly/>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" defaultValue={user?.email} readOnly/>
              <label htmlFor="datanascimento">Data de Nascimento:</label>
              <input type="text" name="datanascimento" defaultValue={nascimentoEditado} readOnly/>
              <label htmlFor="senha">Senha:</label>
              <input type="password" name="senha" defaultValue={'senhasenha'} readOnly/>
              <button className="p-2 px-4 rounded md:mt-4" onClick={() => setEditar(true)}>Editar perfil</button>
            </form>
          </div>
        )}

      </div>
    </section>
  )
}