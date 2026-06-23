'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, X, ArrowLeft } from 'lucide-react';
import ArticleAdmin from '@/components/article-admin';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError('Email ou mot de passe incorrect');
      } else {
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
      }
    } catch {
      setLoginError('Erreur de connexion');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleBackToSite = () => {
    router.push('/');
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Show loading state while session is being determined
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#edeff2] dark:bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-[#808080] dark:text-[#888888] font-roboto text-[14px]">
          Chargement...
        </div>
      </div>
    );
  }

  // If authenticated, show the admin panel (ArticleAdmin has its own full UI)
  if (session) {
    return <ArticleAdmin onClose={handleSignOut} />;
  }

  // Not authenticated — show login form
  return (
    <div className="min-h-screen bg-[#edeff2] dark:bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0176cc]/10 dark:bg-[#0176cc]/20 rounded-[2px] flex items-center justify-center">
              <Lock size={20} className="text-[#0176cc]" />
            </div>
            <div>
              <h1 className="font-oswald font-bold text-lg text-pure-black dark:text-white">Connexion Admin</h1>
              <p className="text-[13px] text-steel dark:text-fog">Accès réservé à l&apos;administrateur</p>
            </div>
          </div>
          <button
            onClick={handleBackToSite}
            className="w-8 h-8 flex items-center justify-center text-steel hover:text-pure-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[13px] font-roboto font-medium text-graphite dark:text-ash mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="admin@mauricenontondji.com"
              required
              className="w-full h-10 px-3 text-[14px] font-roboto bg-paper dark:bg-[#333333]/50 border border-mist dark:border-[#cccccc]/30 rounded-[2px] text-pure-black dark:text-white placeholder:text-steel dark:placeholder:text-[#cccccc] focus:outline-none focus:ring-2 focus:ring-[#0176cc]/30 focus:border-[#0176cc] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-roboto font-medium text-graphite dark:text-ash mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-10 px-3 text-[14px] font-roboto bg-paper dark:bg-[#333333]/50 border border-mist dark:border-[#cccccc]/30 rounded-[2px] text-pure-black dark:text-white placeholder:text-steel dark:placeholder:text-[#cccccc] focus:outline-none focus:ring-2 focus:ring-[#0176cc]/30 focus:border-[#0176cc] transition-colors"
            />
          </div>

          {loginError && (
            <p className="text-[13px] text-destructive font-roboto">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full h-10 bg-[#0176cc] text-white text-[14px] font-roboto font-medium rounded-[2px] hover:bg-[#0176cc]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loginLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-mist dark:border-white/10">
          <button
            onClick={handleBackToSite}
            className="text-[13px] font-roboto text-steel dark:text-fog hover:text-pure-black dark:hover:text-white transition-colors cursor-pointer"
          >
            &larr; Retour au site
          </button>
        </div>
      </div>
    </div>
  );
}