import api from "./api"

const baseEndpoint = "/juegos";

export const obtenerJuegos = async () => {
  const respuestaJuegos = await api.get(baseEndpoint)

  return respuestaJuegos.data
}