import Image from 'next/image';

const partners = [
  {
    name: 'AUF',
    fullName: 'Agence Universitaire de la Francophonie',
    logo: '/logos/auf.jpg',
    type: 'image' as const,
  },
  {
    name: 'FeexPay',
    fullName: 'FeexPay',
    logo: '',
    type: 'text' as const,
  },
  {
    name: 'Mastercard Foundation',
    fullName: 'Mastercard Foundation',
    logo: '/logos/mastercard-foundation.png',
    type: 'image' as const,
  },
  {
    name: 'LinkedInLocal Cotonou',
    fullName: 'LinkedInLocal Cotonou',
    logo: '',
    type: 'text' as const,
  },
  {
    name: 'REMAPSEN',
    fullName: 'REMAPSEN',
    logo: '',
    type: 'text' as const,
  },
  {
    name: 'ÎLE SACREE',
    fullName: 'ÎLE SACREE',
    logo: '',
    type: 'text' as const,
  },
];

export default function Trust() {
  return (
    <section className="bg-cloud">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[16px] font-roboto font-medium text-steel mb-2">
            Ils me font confiance
          </p>
          <p className="text-[15px] font-roboto text-ash">
            Entreprises et organisations qui ont fait appel à mon expertise
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center gap-2 opacity-50 hover:opacity-80 transition-opacity"
            >
              {partner.type === 'image' && partner.logo ? (
                <div className="relative h-12 sm:h-14 w-auto">
                  <Image
                    src={partner.logo}
                    alt={partner.fullName}
                    width={140}
                    height={56}
                    className="h-full w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-[18px] sm:text-[20px] font-oswald font-bold text-steel leading-none">
                    {partner.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}