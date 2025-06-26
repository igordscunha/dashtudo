import { useAuth } from "../../contexts/AuthContext"

export const ProfilePage = () => {

  const { user } = useAuth();

  return(
    <section className="p-6 md:mt-8">
      <p className="pb-14 text-3xl">Meu Perfil</p>
      <div>
        <form className="!border-0">
          <label htmlFor="nome">Nome:</label>
          <input type="text" name="nome" placeholder="Insira seu nome..." required defaultValue={user?.nome}/>
          <label htmlFor="sobrenome">Sobrenome:</label>
          <input type="text" name="sobrenome" placeholder="Insira seu sobrenome..." required defaultValue={user?.sobrenome}/>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" placeholder="Insira seu email..." required defaultValue={user?.email}/>
          <label htmlFor="datanascimento">Data de Nascimento:</label>
          <input type="date" name="datanascimento" required/>
          <label htmlFor="senha">Senha:</label>
          <input type="password" name="senha" placeholder="Insira sua senha..." required/>
          <button type="submit" className="p-2 px-4 rounded md:mt-4">Editar</button>
        </form>
      </div>
    </section>
  )
}