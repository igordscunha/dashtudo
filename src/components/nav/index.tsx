import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { MobileMenu } from "../menu";
import Logo from "../../assets/logo.svg"

export const Navbar = () => {

  const { user, logout } = useAuth();

  return(
    <nav className="h-18 bg-[#878ECD] p-6">
      <div className="flex justify-between items-center h-full">

        <div className="text-white flex justify-between w-full">
          <img src={Logo} width={40} alt="Logo do DashTudo"/>
        </div>

        <div>
          <div className="flex md:hidden">
            <MobileMenu/>
          </div>
          <div className="gap-10 hidden md:flex text-white">
              <Link to="/">Home</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Perfil</Link>
              {user ? (
                <button onClick={logout}>Sair</button>
              ) : (
                <Link to="/login">Entrar</Link>
              )}
          </div>          
        </div>
      </div>
    </nav>
  )
}