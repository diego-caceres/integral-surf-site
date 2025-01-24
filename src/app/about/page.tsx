"use client";
const team = [
  {
    id: 1,
    name: "Leandro Gallo",
    role: "Fundador y Surfista",
    bio: "Le encanta conectar personas con el surf.",
  },
  {
    id: 2,
    name: "Juan Ignacio Perez",
    role: "Intructor y Surfista",
    bio: "Experto en llevarte a los mejores spots.",
  },
  {
    id: 3,
    name: "Romina Rissotto",
    role: "Fotografía y Surfista",
    bio: "Caputarndo los mejores momentos en la mejor calidad.",
  },
];

export default function About() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quiénes Somos</h1>
      {team.map((member) => (
        <div key={member.id} className="mb-4 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold">{member.name}</h2>
          <p className="text-gray-600">{member.role}</p>
          <p>{member.bio}</p>
        </div>
      ))}
    </div>
  );
}
