"use client";

import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/images/about-hero.jpg"
          alt="Integral Surf Team"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white text-center">
            Nuestra Historia
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif text-primary">
                Nuestra Misión
              </h2>
              <p className="text-lg text-textPrimary leading-relaxed">
                En Integral Surf, creemos en la transformación a través del
                surf. Nuestra misión es crear experiencias únicas que conecten a
                las personas con el océano, fomentando un estilo de vida
                saludable y sostenible.
              </p>
              <p className="text-lg text-textPrimary leading-relaxed">
                Cada viaje que organizamos está diseñado para ofrecer no solo
                excelentes condiciones de surf, sino también una experiencia
                cultural auténtica y momentos memorables.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/images/about-mission.jpg"
                alt="Surfing Experience"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-accent text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-serif text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-textPrimary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative h-64 w-64 mx-auto rounded-md overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif text-primary">
                  {member.name}
                </h3>
                <p className="text-accent font-medium">{member.role}</p>
                <p className="text-textPrimary max-w-md mx-auto">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Únete a nosotros en uno de nuestros viajes y descubre la magia del
            surf mientras exploras destinos increíbles.
          </p>
          <Link
            href="/viajes"
            className="inline-block bg-accent text-white px-8 py-3 rounded-full 
                     hover:bg-accent/90 transition-colors font-medium"
          >
            Ver Viajes Disponibles
          </Link>
        </div>
      </section>

      <WhatsAppButton onlyBubble />
    </div>
  );
}

const values = [
  {
    icon: "🌊",
    title: "Pasión por el Surf",
    description:
      "El surf es más que un deporte, es un estilo de vida que nos conecta con la naturaleza y nos enseña valiosas lecciones de perseverancia y humildad.",
  },
  {
    icon: "🤝",
    title: "Comunidad",
    description:
      "Creemos en el poder de la comunidad y en compartir experiencias significativas que crean lazos duraderos entre surfistas.",
  },
  {
    icon: "🌍",
    title: "Sostenibilidad",
    description:
      "Nos comprometemos a proteger nuestros océanos y playas, promoviendo prácticas sostenibles en todos nuestros viajes.",
  },
];

const team = [
  {
    name: "Leandro Gallo",
    role: "Fundador, Intructor y Surfista",
    image: "/images/team/lea.jpg",
    bio: "Con más de 15 años de experiencia en el surf, le encanta conectar personas con el surf.",
  },
  {
    name: "Juan Ignacio Perez",
    role: "Intructor y Surfista",
    image: "/images/team/rulo.jpg",
    bio: "Experto en llevarte a los mejores spots, y ayudarte a leer las olas.",
  },
  {
    name: "Romina Rissotto",
    role: "Fotógrafa y Surfista",
    image: "/images/team/romi.jpg",
    bio: "Caputarndo los mejores momentos en la mejor calidad.",
  },
];
