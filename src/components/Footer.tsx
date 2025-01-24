export default function Footer() {
  return (
    <footer className="py-4 bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 text-center">
        © {new Date().getFullYear()} Integral Surf - Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
