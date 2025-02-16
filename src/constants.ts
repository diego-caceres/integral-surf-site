import { Trip } from "@/types/trip";

export const trips: Trip[] = [
  {
    id: "1",
    title: "Un fin de semana en La Paloma",
    slug: "la-paloma-marzo",
    destiny: "La Paloma, Uy.",
    coachingSubtitle: "Coaching por integral surf",
    date: "Marzo",
    date2: "7 al 9",
    shortDescription:
      "Conocida por su diversidad de olas y playas, La Paloma es el spot ideal tanto para principiantes como para surfistas experimentados. Disfruta de sesiones épicas en un entorno tranquilo, con una comunidad surfista amigable y una atmósfera relajada típica de la costa uruguaya.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 9,
    images: [
      "/images/paloma1.jpg",
      "/images/paloma2.jpg",
      "/images/paloma3.jpg",
      "/images/paloma4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000,
    finalPrice: 70000,
    promoEndMessage: "2025-02-01",
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
  {
    id: "2",
    title: "Un fin de semana en el Cabo Polonio",
    slug: "cabo-polonio-abril",
    destiny: "Cabo Polonio, Uy.",
    coachingSubtitle: "Coaching por integral surf",
    date: "Abril",
    date2: "4, 5 y 6",
    shortDescription:
      "Sumérgete en la magia de Cabo Polonio, un destino aislado donde las dunas doradas y el mar Atlántico ofrecen olas perfectas para los más aventureros. Desconéctate del mundo y vive el surf en su estado más puro, rodeado de una naturaleza virgen y un ambiente mágico",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 10,
    images: [
      "/images/cabo1.jpg",
      "/images/cabo2.jpg",
      "/images/cabo3.jpg",
      "/images/cabo4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000,
    finalPrice: 70000,
    promoEndMessage: "2025-02-01",
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
  {
    id: "3",
    slug: "garopaba-abril",
    title: "Brasil",
    title2: "Garopaba",
    destiny: "Garopaba, Br.",
    date: "Abril",
    date2: "12 al 20",
    headerImage: "/images/headerGaropaba.jpg",
    coachingSubtitle: "Coaching por Marco Giorgi",
    shortDescription:
      "Garopaba combina la energía del surf con el espíritu vibrante de Brasil. Sus playas de aguas cálidas y olas consistentes la convierten en un destino imperdible para cualquier surfista. Además, su ambiente relajado, gastronomía local y exuberante naturaleza harán de tu viaje una experiencia inolvidable.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 8,
    images: [
      "/images/garopaba1.jpg",
      "/images/garopaba2.jpg",
      "/images/garopaba3.jpg",
      "/images/garopaba4.jpg",
    ],
    promoPrice: 890, // Optional
    finalPrice: 980,
    promoEndMessage: "Válido hasta Febrero", // Optional
    finalPriceMessage: "Válido desde Marzo", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
    section1Title: "¡Nos vamos al mar!",
    section1Description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section1Description2:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section1Image: "/images/trips/garopabaSection1.png",
    section2Title: "Una semana entre la selva y el mar.",
    section2Description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section2Image: "/images/trips/garopabaSection2.jpg",
    contentSections: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle2: "Video analisis & coaching",
        description2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        imageUrl: "/images/trips/garopabaContent1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        imageUrl: "/images/trips/garopabaContent2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        imageUrl: "/images/trips/garopabaContent3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        imageUrl: "/images/trips/garopabaContent4.jpg",
      },
    ],
  },
  {
    id: "4",
    title: "Un fin de semana en Punta del Diablo",
    slug: "punta-del-diablo-mayo",
    destiny: "Punta del Diablo, Uy.",
    coachingSubtitle: "Coaching por integral surf",
    date: "Mayo",
    date2: "9, 10 y 11",
    shortDescription:
      "Descubre el encanto rústico de Punta del Diablo, un pequeño pueblo pesquero convertido en un paraíso del surf. Sus potentes olas, vibrante cultura local y atardeceres inolvidables hacen de este un destino ideal para quienes buscan surf y disfrutar junto al mar.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 9,
    images: [
      "/images/pdd1.jpg",
      "/images/pdd2.jpg",
      "/images/pdd3.jpg",
      "/images/pdd4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000, // Optional
    finalPrice: 70000,
    promoEndMessage: "2025-02-01", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
  {
    id: "5",
    title: "7 días en Santa Teresa, Costa Rica",
    slug: "costa-rica-junio",
    destiny: "Santa Teresa, CR.",
    coachingSubtitle: "Coaching por integral surf + Zeneidas",
    date: "Junio",
    date2: "16 al 24",
    shortDescription:
      "Experimenta el paraíso tropical en Santa Teresa, donde la selva se encuentra con el océano para ofrecerte olas constantes y un ambiente relajado. Con su combinación de surf de clase mundial, vida nocturna animada y paisajes espectaculares, es el destino perfecto para surfistas de todos los niveles.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 9,
    images: [
      "/images/garopaba1.jpg",
      "/images/garopaba2.jpg",
      "/images/garopaba3.jpg",
      "/images/garopaba4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000, // Optional
    finalPrice: 70000,
    promoEndMessage: "2025-02-01", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
  {
    id: "6",
    title: "8 días en Lobitos, Perú",
    slug: "lobitos-peru-agosto",
    destiny: "Lobitos, Pe.",
    coachingSubtitle: "Coaching por Henry Espinosa",
    date: "Agosto",
    date2: "21 al 30",
    shortDescription:
      "Vive la experiencia única de surfear en Lobitos, un lugar donde las olas perfectas se encuentran con un paisaje desértico impresionante. Con olas de izquierda largas y consistentes, este destino es un sueño hecho realidad para los amantes del longboard y del surf de calidad mundial.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 9,
    images: [
      "/images/lobitos1.jpg",
      "/images/lobitos2.jpg",
      "/images/lobitos3.jpg",
      "/images/lobitos4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000, // Optional
    finalPrice: 70000,
    promoEndMessage: "2025-02-01", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
    headerVideo: "https://www.youtube.com/watch?v=AvBeRsj1YkM",
  },
  {
    id: "7",
    title: "Un fin de semana en el Cabo Polonio",
    slug: "cabo-polonio-setiembre",
    destiny: "Cabo Polonio, Uy.",
    coachingSubtitle: "Coaching por integral surf",
    date: "Setiembre",
    date2: "26, 27 y 28",
    shortDescription:
      "Sumérgete en la magia de Cabo Polonio, un destino aislado donde las dunas doradas y el mar Atlántico ofrecen olas perfectas para los más aventureros. Desconéctate del mundo y vive el surf en su estado más puro, rodeado de una naturaleza virgen y un ambiente mágico.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 8,
    images: [
      "/images/cabo1.jpg",
      "/images/cabo2.jpg",
      "/images/cabo3.jpg",
      "/images/cabo4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000, // Optional
    finalPrice: 70000,
    promoEndMessage: "2025-02-01", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
  {
    id: "8",
    title: "7 días en Garopaba, Brasil",
    slug: "garopaba-octubre",
    destiny: "Garopaba, Br.",
    coachingSubtitle: "Coaching por Marco Giorgi",
    date: "Octubre",
    date2: "4 al 12",
    shortDescription:
      "Garopaba combina la energía del surf con el espíritu vibrante de Brasil. Sus playas de aguas cálidas y olas consistentes la convierten en un destino imperdible para cualquier surfista. Además, su ambiente relajado, gastronomía local y exuberante naturaleza harán de tu viaje una experiencia inolvidable.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 9,
    images: [
      "/images/garopaba1.jpg",
      "/images/garopaba2.jpg",
      "/images/garopaba3.jpg",
      "/images/garopaba4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000, // Optional
    finalPrice: 70000,
    promoEndMessage: "2025-02-01", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
  {
    id: "9",
    title: "Un fin de semana en Punta del Diablo",
    slug: "punta-del-diablo-mayo",
    destiny: "Punta del Diablo, Uy.",
    coachingSubtitle: "Coaching por integral surf",
    date: "Noviembre",
    date2: "14, 15 y 16",
    shortDescription:
      "Descubre el encanto rústico de Punta del Diablo, un pequeño pueblo pesquero convertido en un paraíso del surf. Sus potentes olas, vibrante cultura local y atardeceres inolvidables hacen de este un destino ideal para quienes buscan surf y disfrutar junto al mar.",
    description:
      "Un viaje increíble para disfrutar de las olas de Chapadmalal. Incluye hospedaje frente al mar, transporte, y clases de surf para todos los niveles.",
    seats: 9,
    images: [
      "/images/pdd1.jpg",
      "/images/pdd2.jpg",
      "/images/pdd3.jpg",
      "/images/pdd4.jpg",
    ],
    headerImage: "/images/tripHeader.jpg",
    promoPrice: 50000, // Optional
    finalPrice: 70000,
    promoEndMessage: "2025-02-01", // Optional
    location: { lat: -4.4550094, lng: -81.2816191 },
  },
];
