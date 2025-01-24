"use client";
const products = [
  { id: 1, name: "Remera Surf", price: "$25" },
  { id: 2, name: "Gorra Aloha", price: "$15" },
];

export default function Productos() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Nuestros Productos</h1>
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            className="mb-2 p-4 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-600">Precio: {product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
