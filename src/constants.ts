import { Trip } from "@/types/trip";

export const trips: Trip[] = [
  {
    id: "1",
    order: 1,
    slug: "la-paloma-marzo",
    title: "La Paloma",
    destiny: "La Paloma, Uy.",
    coaching_subtitle: "Coaching por integral surf",
    date_days: "Marzo",
    date_month: "7 al 9",
    header_image: "/images/tripHeader.jpg",
    // seats: 9,
    // images: [
    //   "/images/paloma1.jpg",
    //   "/images/paloma2.jpg",
    //   "/images/paloma3.jpg",
    //   "/images/paloma4.jpg",
    // ],
    price_promo: 300,
    price_final: 350,
    price_promo_message: "Válido hasta Enero", // Optional
    price_final_message: "Válido desde Febrero", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/paloma1.jpg",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/paloma2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/paloma1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/paloma2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/paloma3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/paloma4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
  {
    id: "2",
    order: 2,
    slug: "cabo-polonio-abril",
    title: "Cabo Polonio",
    destiny: "Cabo Polonio, Uy.",
    coaching_subtitle: "Coaching por integral surf",
    date_days: "Abril",
    date_month: "4, 5 y 6",
    header_image: "/images/tripHeader.jpg",
    // seats: 10,
    // images: [
    //   "/images/cabo1.jpg",
    //   "/images/cabo2.jpg",
    //   "/images/cabo3.jpg",
    //   "/images/cabo4.jpg",
    // ],
    price_promo: 300,
    price_final: 350,
    price_promo_message: "Válido hasta Enero", // Optional
    price_final_message: "Válido desde Febrero", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/trips/garopabaSection1.png",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/trips/garopabaSection2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/cabo1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/cabo3.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/cabo2.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/cabo4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
  {
    id: "3",
    order: 3,
    slug: "garopaba-abril",
    title: "Brasil",
    title_2: "Garopaba",
    destiny: "Garopaba, Br.",
    date_days: "Abril",
    date_month: "12 al 20",
    header_image: "/images/headerGaropaba.jpg",
    coaching_subtitle: "Coaching por Marco Giorgi",
    // seats: 8,
    // images: [
    //   "/images/garopaba1.jpg",
    //   "/images/garopaba2.jpg",
    //   "/images/garopaba3.jpg",
    //   "/images/garopaba4.jpg",
    // ],
    price_promo: 890, // Optional
    price_final: 980,
    price_promo_message: "Válido hasta Febrero", // Optional
    price_final_message: "Válido desde Marzo", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/trips/garopabaSection1.png",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/trips/garopabaSection2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/trips/garopabaContent1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/trips/garopabaContent2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/trips/garopabaContent3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/trips/garopabaContent4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
  {
    id: "4",
    order: 4,
    slug: "punta-del-diablo-mayo",
    title: "Punta del Diablo",
    destiny: "Punta del Diablo, Uy.",
    coaching_subtitle: "Coaching por integral surf",
    date_days: "Mayo",
    date_month: "9, 10 y 11",
    header_image: "/images/tripHeader.jpg",
    // seats: 9,
    // images: [
    //   "/images/pdd1.jpg",
    //   "/images/pdd2.jpg",
    //   "/images/pdd3.jpg",
    //   "/images/pdd4.jpg",
    // ],
    price_promo: 400, // Optional
    price_final: 450,
    price_promo_message: "Válido hasta Marzo", // Optional
    price_final_message: "Válido desde Abril", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/paloma1.jpg",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/paloma2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/pdd1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/pdd2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/pdd3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/pdd4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
  {
    id: "5",
    order: 5,
    title: "Costa Rica",
    title_2: "Santa Teresa",
    slug: "costa-rica-junio",
    destiny: "Santa Teresa, CR.",
    coaching_subtitle: "Coaching por integral surf + Zeneidas",
    date_days: "Junio",
    date_month: "16 al 24",
    header_image: "/images/costa-rica/tripHeader.jpeg",
    // seats: 9,
    // images: [
    //   "/images/garopaba1.jpg",
    //   "/images/garopaba2.jpg",
    //   "/images/garopaba3.jpg",
    //   "/images/garopaba4.jpg",
    // ],
    price_promo: 2900, // Optional
    price_final: 3100,
    price_promo_message: "Válido hasta Abril", // Optional
    price_final_message: "Válido desde Mayo", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/costa-rica/section1.jpg",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/costa-rica/section2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/costa-rica/content1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/costa-rica/content2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/costa-rica/content3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/costa-rica/content4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/costa-rica/final1.jpg",
    final_img_2: "/images/costa-rica/final2.jpg",
  },
  {
    id: "6",
    order: 6,
    title: "Perú",
    title_2: "Lobitos",
    slug: "lobitos-peru-agosto",
    destiny: "Lobitos, Pe.",
    coaching_subtitle: "Coaching por Henry Espinosa",
    date_days: "Agosto",
    date_month: "21 al 30",
    // seats: 9,
    // images: [
    //   "/images/lobitos1.jpg",
    //   "/images/lobitos2.jpg",
    //   "/images/lobitos3.jpg",
    //   "/images/lobitos4.jpg",
    // ],
    header_image: "/images/lobitos/header_image.jpg",
    price_promo: 1500, // Optional
    price_final: 1750,
    price_promo_message: "Válido hasta Junio", // Optional
    price_final_message: "Válido desde Julio", // Optional
    header_video: "",
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/lobitos/section1.jpg",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/lobitos/section2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/lobitos/content1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/lobitos/content2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/lobitos/content3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/lobitos/content4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Lobitos",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=AvBeRsj1YkM",
    final_img_1: "/images/lobitos/final1.jpg",
    final_img_2: "/images/lobitos/final2.jpg",
  },
  {
    id: "7",
    order: 7,
    slug: "cabo-polonio-setiembre",
    title: "Cabo Polonio",
    destiny: "Cabo Polonio, Uy.",
    coaching_subtitle: "Coaching por integral surf",
    date_days: "Setiembre",
    date_month: "26, 27 y 28",
    header_image: "/images/tripHeader.jpg",
    // seats: 8,
    // images: [
    //   "/images/cabo1.jpg",
    //   "/images/cabo2.jpg",
    //   "/images/cabo3.jpg",
    //   "/images/cabo4.jpg",
    // ],
    price_promo: 300,
    price_final: 350,
    price_promo_message: "Válido hasta Julio", // Optional
    price_final_message: "Válido desde Agosto", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/trips/garopabaSection1.png",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/trips/garopabaSection2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/cabo1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/cabo2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/cabo3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/cabo4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
  {
    id: "8",
    order: 8,
    slug: "garopaba-octubre",
    title: "Brasil",
    title_2: "Garopaba",
    destiny: "Garopaba, Br.",
    date_days: "Octubre",
    date_month: "4 al 12",
    header_image: "/images/headerGaropaba.jpg",
    coaching_subtitle: "Coaching por Marco Giorgi",
    // seats: 9,
    // images: [
    //   "/images/garopaba1.jpg",
    //   "/images/garopaba2.jpg",
    //   "/images/garopaba3.jpg",
    //   "/images/garopaba4.jpg",
    // ],
    price_promo: 890, // Optional
    price_final: 980,
    price_promo_message: "Válido hasta Agosto", // Optional
    price_final_message: "Válido desde Setiembre", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/trips/garopabaSection1.png",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/trips/garopabaSection2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/trips/garopabaContent1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/trips/garopabaContent2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/trips/garopabaContent3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/trips/garopabaContent4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
  {
    id: "9",
    order: 9,
    slug: "punta-del-diablo-noviembre",
    title: "Punta del Diablo",
    destiny: "Punta del Diablo, Uy.",
    coaching_subtitle: "Coaching por integral surf",
    date_days: "Noviembre",
    date_month: "14, 15 y 16",
    header_image: "/images/tripHeader.jpg",
    // seats: 9,
    // images: [
    //   "/images/pdd1.jpg",
    //   "/images/pdd2.jpg",
    //   "/images/pdd3.jpg",
    //   "/images/pdd4.jpg",
    // ],
    price_promo: 400, // Optional
    price_final: 450,
    price_promo_message: "Válido hasta Setiembre", // Optional
    price_final_message: "Válido desde Octubre", // Optional
    section_1_title: "¡Nos vamos al mar!",
    section_1_description: `El propósito es ayudarte a <strong>lograr tus objetivos</strong> de manera consciente, ya sea <strong>conectar</strong> por primera vez con el surf o a mejorar tu <strong>performance</strong> sobre las olas.<br/><br/>

Merecemos <strong>tiempo de calidad</strong> en una <strong>energía cuidada y presente</strong>. <br/><br/>

¡Celebremos la vida juntos!`,
    section_1_subdescription:
      "Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos.",
    section_1_image: "/images/trips/garopabaSection1.png",
    section_2_title: "Una semana entre la selva y el mar.",
    section_2_description: `Serán 6 noches y 7 días entre el morro y el mar, junto a un referente internacional del surfing, que nos recibe de brazos abiertos, donde ha desarrollado su carrera como surfista profesional
    <br/><br/>
Juntos a iremos en busca de los mejores olas de la región, conoceremos la cultura local y nos adentraremos en senderos subtropicales.  `,
    section_2_image: "/images/trips/garopabaSection2.jpg",
    trip_contents: [
      {
        title: "Surf",
        subtitle: "Marco Giorgi",
        description:
          "Nos espera en su lugar para compatirnos su conocimiento del surfing, de su casa y de la vida en general. Surfista de alma y aventurero nos permite conectar con la esencia mas pura del surf y del ser huamano.",
        subtitle_2: "Video analisis & coaching",
        description_2:
          "Utilizaremos la herramienta del video análisis para visualizar y corregir tu surfing de manera que puedas mejorar tu curva de aprendizaje.",
        image_url: "/images/pdd1.jpg",
      },
      {
        title: "Aventuras",
        description:
          "Durante la semana, nos regalamos momentos conectar con la naturaleza en todos sus sentidos, haremos trilhas e iremos a cascadas y miradores, para conocer Garopaba desde diferentes lugares.",
        image_url: "/images/pdd2.jpg",
      },
      {
        title: "Yoga",
        description:
          "El yoga es una disciplina que nos acompaña en cada viaje, habilitando una percepción consciente sobre nuestro cuerpo, mente y espíritu. A nivel fisico, actúa de manera directa en lo que será tu experiencia dentro del agua.",
        image_url: "/images/pdd3.jpg",
      },
      {
        title: "Hospedaje",
        description:
          "La Pousada Pé na Areia está situada en Praia da Ferrugem, en Garopaba. Localizada a 30 metros del mar. La conexión Wi-Fi es gratuita en todas partes y el desayuno es buffet. Los apartamento están equipados con TV, cocina y baño y  son compartidos con los participantes del surf trip.",
        image_url: "/images/pdd4.jpg",
      },
    ],
    section_video_title: "Mirá nuestro último viaje a Brasil",
    section_video_description: `Los Surftrips a Garopaba son un destino asegurado en nuestro calendario anual.
Comenzamos en semana de turismo, acortamos en invierno en agosto y cerramos en octubre con calorcito y aguas azules. <br/><br/>

Junto a Marco Giorgi, quién es parte de nuestro equipo, hemos desarrollado una experiencia que va desde vivencias gastronómicas, paseos por la naturaleza y un abordaje técnico sobre el surf de cada participante. `,
    section_video_url: "https://www.youtube.com/watch?v=MZenGpwdJnM",
    final_img_1: "/images/trips/garopabaFinal1.jpg",
    final_img_2: "/images/trips/garopabaFinal2.jpg",
  },
];
