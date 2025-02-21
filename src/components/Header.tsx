import React, { useState, useEffect } from 'react';
import { ChevronRight, Home, User, LogOut, Upload } from 'lucide-react';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { Logo } from './Logo';
import { LoginModal } from './LoginModal';
import { LogoUploadModal } from './LogoUploadModal';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuthContext } from '../contexts/AuthContext';
import { TypewriterEffect } from './TypewriterEffect';

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [churchLogo, setChurchLogo] = useState<string | null>(null);
  const [churchName, setChurchName] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const isProfilePage = location.pathname.includes('/profile') || 
                       location.pathname === '/dashboard' || 
                       location.pathname === '/detalhes-membros'||
                       location.pathname === '/settings'||
                       location.pathname === '/visitantes'||
                       location.pathname === '/consoleadmin'||
                       location.pathname === '/children-management';

  useEffect(() => {
    if (user) {
      fetchChurchLogo();
      fetchChurchName();
    }
  }, [user]);

  const fetchChurchLogo = async () => {
    if (!user) return;
    
    try {
      setChurchLogo(null); // Reseta o estado do logo antes de buscar
      const { data, error } = await supabase
        .from('church_logos')
        .select('logo_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Erro ao buscar logo da igreja:', error);
        }
        return;
      }

      if (data) setChurchLogo(data.logo_url);
    } catch (error) {
      console.error('Error fetching church logo:', error);
    }
  };

  const fetchChurchName = async () => {
    if (!user) return;
    
    try {
      setChurchName(''); // Reseta o estado do nome antes de buscar
      const { data, error } = await supabase
        .from('dados_igreja')
        .select('nome_igreja')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Erro ao buscar nome da igreja:', error);
        }
        return;
      }

      if (data) setChurchName(data.nome_igreja);
    } catch (error) {
      console.error('Error fetching church name:', error);
    }
  };

  const handleLogoSuccess = async (logoUrl: string) => {
    try {
      const { error } = await supabase
        .from('church_logos')
        .upsert({ 
          user_id: user?.id,
          logo_url: logoUrl
        });

      if (error) throw error;
      
      setChurchLogo(logoUrl);
      addToast('Logo atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Error updating logo:', error);
      addToast('Erro ao atualizar logo', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      addToast('Logout realizado com sucesso', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      addToast('Erro ao fazer logout', 'error');
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#D3D3D3]/50 to-[#C0C0C0]/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-800 truncate max-w-[200px] sm:max-w-none">
              FaithFlow Tech{user && churchName && ` - ${churchName}`}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {isProfilePage ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  {churchLogo ? (
                    <img 
                      src={churchLogo} 
                      alt="Logo da Igreja" 
                      className="h-8 w-auto cursor-pointer"
                      onClick={() => setIsLogoModalOpen(true)}
                    />
                  ) : (
                    <button
                      onClick={() => setIsLogoModalOpen(true)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Adicionar Logo</span>
                    </button>
                  )}
                </div>
                <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                  <Home className="h-4 w-4" />
                  <span>Início</span>
                </Link>
                <Link to="/profile/update" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                  <User className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <>
                <NavLink href="#features">Recursos</NavLink>
                <NavLink href="#demo">Demonstração</NavLink>
                <NavLink href="#contact">Contato</NavLink>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Área do Cliente
                </button>
              </>
            )}
          </div>
          <MobileMenu 
            onOpenLogin={() => setIsLoginModalOpen(true)} 
            isProfilePage={isProfilePage}
            onLogout={handleLogout}
            churchLogo={churchLogo}
          />
        </div>
      </nav>

      {!isProfilePage && (
        <div className="container mx-auto px-6 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                <TypewriterEffect text="Tecnologia a Serviço da Fé" />
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                Transforme a maneira como sua igreja gerencia membros e visitantes com nossa solução impulsionada por IA.
              </p>
              <a href="#demo" className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition">
                Experimente Grátis por 30 dias
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0 px-4 md:px-0">
              <img 
                src="https://i.postimg.cc/cL4RwxDb/ipad-landscape-on-keyboard-and-iphone-5s-portrait.png"
                alt="Tecnologia e Igreja"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onSuccess={handleLogoSuccess}
      />
    </header>
  );
}