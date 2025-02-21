import React, { useState } from 'react';
import { Menu, X, Home, User, LogOut } from 'lucide-react';
import { NavLink } from './NavLink';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  onOpenLogin?: () => void;
  isProfilePage?: boolean;
  onLogout?: () => void;
  churchLogo?: string | null;
}

export function MobileMenu({ onOpenLogin, isProfilePage, onLogout, churchLogo }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 z-50">
          <nav className="flex flex-col space-y-4">
            {isProfilePage ? (
              <>
                {churchLogo && (
                  <img 
                    src={churchLogo} 
                    alt="Logo da Igreja" 
                    className="h-8 w-auto mb-4"
                  />
                )}
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Início</span>
                </Link>
                <Link 
                  to="/profile/update" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <NavLink href="#features">Recursos</NavLink>
                <NavLink href="#demo">Demonstração</NavLink>
                <NavLink href="#contact">Contato</NavLink>
                <button
                  onClick={() => {
                    if (onOpenLogin) onOpenLogin();
                    setIsOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-indigo-600"
                >
                  Área do Cliente
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}