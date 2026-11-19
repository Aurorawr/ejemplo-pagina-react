import api from "./api";

const baseEndpoint = "/compras";

export const obtenerLinkDePago = async (monto) => {
  const idSesion = crypto.randomUUID(); 
  const ordenDeCompra = `ORD-${crypto.randomUUID().replaceAll('-', '').slice(0, 20)}`;
  const resultado = await api.post(`${baseEndpoint}/generar-link-pago`, {
    ordenDeCompra,
    idSesion,
    monto,
    urlRetorno: "http://localhost:5173/compraRealizada"
  })

  return resultado.data;
}

export const confirmarPago = async (tokenWebpay) => {
  const resultado = await api.post(`${baseEndpoint}/confirmar-pago`, {tokenWebpay});

  return resultado.data;
}