import axios from "axios";

export const obtenerJuegos = async () => {
  const respuestaJuegos = await axios.get("http://localhost:3000/api/v1/juegos")

  return respuestaJuegos.data
}