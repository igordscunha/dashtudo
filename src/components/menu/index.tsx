import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineHome } from 'react-icons/ai';


const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <FiMenu className={className}/>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IoCloseOutline className={className}/>
);

const HomeIcon: React.FC<{className?: string}> = ({className}) => (
  <AiOutlineHome className={className}/>
);

const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <MdOutlineSpaceDashboard className={className}/>
);

const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CgProfile className={className}/>
);

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
  >
    <span className="mr-4 w-5 h-5">{icon}</span>
    <span className="text-lg font-medium">{label}</span>
  </button>
);

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  const handleMenuItemClick = (item: string): void => {
    console.log(`Clicou em: ${item}`);
    closeMenu();
    // Aqui você pode adicionar a lógica de navegação
  };

  const { user, logout } = useAuth();

  return (
    <div className="relative">
      {/* Botão do Menu */}
      <button
        onClick={toggleMenu}
        className="p-3 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Menu"
      >
        {isOpen ? (
          <CloseIcon className="w-6 h-6 text-white" />
        ) : (
          <MenuIcon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Menu Lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header do Menu */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={closeMenu}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            aria-label="Fechar menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Itens do Menu */}
        <nav className="flex flex-col">
          <Link to="/">
            <MenuItem 
              icon={<HomeIcon className='w-5 h-5'/>}
              label="Home"
              onClick={() => handleMenuItemClick('Home')}
            />
          </Link>

          <Link to="/profile">
            <MenuItem
              icon={<ProfileIcon className="w-5 h-5" />}
              label="Profile"
              onClick={() => handleMenuItemClick('Profile')}
            />          
          </Link>

          <Link to="/dashboard">
            <MenuItem
              icon={<DashboardIcon className="w-5 h-5" />}
              label="Dashboard"
              onClick={() => handleMenuItemClick('Dashboard')}
            />          
          </Link>
        </nav>

        {/* Footer do Menu (opcional) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <div className='flex w-full text-black justify-end'>
            {user ? (
              <button onClick={() => {logout(); closeMenu()}} className="text-black p-2 px-6 rounded-lg">Sair</button>
            ) : (
              <Link to="/login" onClick={() => {logout(); closeMenu()}}><button>Entrar</button></Link>
              )
            }
          </div>

          <p className="text-sm text-gray-500 text-center">
            Versão 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};