import React from "react";
import { useEffect, useState } from "react";
import { API_URL } from "./config";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const res = await fetch(`${API_URL}/api/usuarios`);
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setLoading(false);
      }
    }

    cargarUsuarios();
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">🌐 World Chain</h1>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : usuarios.length > 0 ? (
        <ul className="space-y-2">
          {usuarios.map((u, i) => (
            <li
              key={i}
              className="border rounded-lg p-2 bg-gray-100 shadow-sm hover:bg-gray-200 transition"
            >
              {u.nombre} — {u.correo}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
    </div>
  );
}

export default App;
