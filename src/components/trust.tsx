const partners = [
  { name: 'Afrika Business', initials: 'AB' },
  { name: 'Tech Hub Abidjan', initials: 'TH' },
  { name: 'Investir Afrique', initials: 'IA' },
  { name: 'Startup Nation', initials: 'SN' },
  { name: 'Digital Africa', initials: 'DA' },
];

export default function Trust() {
  return (
    <section className="bg-cloud">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[14px] font-roboto font-medium text-steel mb-1">
            Ils me font confiance
          </p>
          <p className="text-[12px] font-roboto text-ash">
            Entreprises et organisations qui ont fait appel à mon expertise
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-brand-blue opacity-40 hover:opacity-70 transition-opacity"
            >
              <div className="w-8 h-8 border border-current rounded-[2px] flex items-center justify-center">
                <span className="text-[11px] font-oswald font-bold leading-none">
                  {partner.initials}
                </span>
              </div>
              <span className="text-[14px] font-roboto font-medium hidden sm:inline">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}