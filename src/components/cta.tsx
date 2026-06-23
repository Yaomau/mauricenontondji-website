'use client';

import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section id="contact" className="bg-obsidian">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[600px] mx-auto text-center">
          <span className="text-[12px] font-roboto font-medium text-fog uppercase tracking-wider">
            Newsletter
          </span>
          <h2 className="font-oswald font-bold text-[28px] sm:text-[32px] text-white mt-2 leading-[1.2]">
            Recevez mes meilleurs{' '}
            <span className="bg-accent-wash-strong px-2 text-white">conseils LinkedIn</span>
          </h2>
          <p className="text-[16px] font-roboto text-fog mt-4 leading-[1.5]">
            Chaque semaine, recevez des stratégies concrètes, des analyses de
            l&apos;algorithme et des templates de publications pour développer votre
            présence sur LinkedIn.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
          >
            {submitted ? (
              <div className="w-full bg-white/10 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white">
                Merci ! Vous êtes inscrit(e) à la newsletter.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 bg-white border border-mist rounded-[2px] px-4 py-3 text-[14px] font-roboto text-pure-black placeholder:text-steel focus:border-pure-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-white text-pure-black text-[16px] font-roboto font-medium px-6 py-3 rounded-[2px] hover:bg-cloud transition-colors shrink-0"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </form>

          <p className="text-[12px] font-roboto text-steel mt-4">
            Pas de spam. Désinscription en un clic.
          </p>
        </div>
      </div>
    </section>
  );
}