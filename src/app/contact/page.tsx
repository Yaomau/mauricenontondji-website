'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import SiteShell from '@/components/site-shell';

export default function ContactPage() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName.trim() || !firstName.trim() || !message.trim()) return;

    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastName: lastName.trim(),
          firstName: firstName.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setSent(true);
        setLastName('');
        setFirstName('');
        setMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Une erreur est survenue. Réessayez.');
      }
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau et réessayez.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteShell currentPage="contact">
      <section className="pt-16 bg-cloud min-h-screen">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[14px] font-roboto text-steel hover:text-brand-blue transition-colors"
            >
              <ArrowLeft size={14} />
              Retour à l&apos;accueil
            </Link>
          </div>

          <span className="text-[12px] font-roboto font-medium text-brand-blue uppercase tracking-wider">
            Contact
          </span>
          <h1 className="font-oswald font-bold text-[36px] sm:text-[44px] text-pure-black mt-2 leading-[1.1]">
            Laissez-moi un message
          </h1>
          <p className="text-[16px] font-roboto text-iron mt-4 leading-[1.5]">
            Vous avez un projet, une question ou vous souhaitez discuter de votre
            stratégie LinkedIn ? Remplissez le formulaire ci-dessous et je vous
            répondrai dans les plus brefs délais.
          </p>

          {sent ? (
            <div className="mt-10 bg-card border border-mist rounded-[2px] p-8 text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <h2 className="font-oswald font-bold text-[24px] text-pure-black mb-2">
                Message envoyé !
              </h2>
              <p className="text-[16px] font-roboto text-iron leading-[1.5]">
                Merci {firstName}, votre message a bien été envoyé. Je vous
                répondrai dans les 24 à 48 heures.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 inline-flex items-center gap-2 text-[14px] font-roboto font-medium text-brand-blue border border-brand-blue/30 px-5 py-2.5 rounded-[2px] hover:border-brand-blue transition-colors cursor-pointer"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {/* Nom & Prénom row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-[14px] font-roboto font-medium text-pure-black mb-2"
                  >
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Votre nom"
                    required
                    className="w-full bg-card border border-mist rounded-[2px] px-4 py-3 text-[14px] font-roboto text-pure-black placeholder:text-steel focus:border-brand-blue focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-[14px] font-roboto font-medium text-pure-black mb-2"
                  >
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Votre prénom"
                    required
                    className="w-full bg-card border border-mist rounded-[2px] px-4 py-3 text-[14px] font-roboto text-pure-black placeholder:text-steel focus:border-brand-blue focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[14px] font-roboto font-medium text-pure-black mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet ou posez votre question..."
                  required
                  rows={7}
                  className="w-full bg-card border border-mist rounded-[2px] px-4 py-3 text-[14px] font-roboto text-pure-black placeholder:text-steel focus:border-brand-blue focus:outline-none transition-colors resize-y min-h-[160px]"
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-[14px] font-roboto text-red-600">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-brand-blue text-white text-[16px] font-roboto font-bold px-8 py-3 rounded-[2px] hover:bg-brand-blue/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {sending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}