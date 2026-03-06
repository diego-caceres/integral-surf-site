-- Create home_sections table
CREATE TABLE IF NOT EXISTS home_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(50) UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  extra_text TEXT,
  button_text TEXT,
  image_url TEXT,
  image_2_url TEXT,
  video_url TEXT,
  background_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on home_sections"
  ON home_sections FOR SELECT
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on home_sections"
  ON home_sections FOR ALL
  USING (auth.role() = 'service_role');

-- Insert default data
INSERT INTO home_sections (section_key, title, description, extra_text, button_text, image_url, image_2_url, video_url)
VALUES
  (
    'our_purpose',
    'Nuestro proposito',
    'es ayudarte a lograr tus objetivos de manera consciente, ya sea conectar por primera vez con el surf o a mejorar tu performance sobre las olas.',
    'Elegimos la naturaleza para interpretar lo más profundo de nuestro ser. El surfing, el yoga y el arte son las experiencias que nos permiten reencontrarnos',
    'Sobre Nosotros',
    '/images/home/image1.png',
    NULL,
    NULL
  ),
  (
    'the_road',
    'El camino del surf no es solitario',
    'juntos aprendemos más y mejor, compartir es un principio básico del surf desde sus orígenes, y es una oportunidad acompañarnos frente a los desafíos que el mar nos propone.',
    NULL,
    'Descubre más',
    '/images/home/the-road-img1.png',
    '/images/home/the-road-img2.png',
    NULL
  ),
  (
    'coaching',
    'La importancia del coaching',
    'surf coachs profesionales y experientes nos acompañan compartiéndonos este deporte desde sus raíces. buscamos aprender la técnica y teoría del surf en profundidad.',
    NULL,
    'Descubre más',
    '/images/home/coaching.jpg',
    NULL,
    NULL
  ),
  (
    'experiences',
    'Experiencias Integrales',
    'En este ciclo de entrevistas a viajeros, Federico García nos cuenta sobre su experiencia aprendiendo a surfear con Integral en Perú',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.youtube.com/embed/EDKX-i1_yMI?si=CLg0ghvuidtUVpG9&autoplay=1&mute=1'
  )
ON CONFLICT (section_key) DO NOTHING;

-- Migration: add background_image_url column if it doesn't exist
ALTER TABLE home_sections ADD COLUMN IF NOT EXISTS background_image_url TEXT;
