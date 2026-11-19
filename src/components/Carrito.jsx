import { obtenerLinkDePago } from "../services/comprasService";
import { formatearPrecio } from '../utils/formatters';

export function Carrito(props) {
  const carrito = props.carrito;

  const comprar = async () => {
    const monto = carrito.reduce(
      (acumulador, juego) => acumulador + juego.precio,
      0,
    );
    const datosLinkDePago = await obtenerLinkDePago(monto);

    window.location.href = `${datosLinkDePago?.url}?token_ws=${datosLinkDePago?.token}`;
  };

  return (
    <aside id="contenido-carrito">
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="carrito"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            Tu carrito
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {carrito.length == 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <>
              <ul id="items-carrito" className="list-group">
                {carrito.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <div className="card">
                      <img
                        src={item.imagen}
                        className="card-img-top"
                        alt={item.nombre}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.nombre}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary d-flex align-items-center">
                          <span className="flex-fill">{formatearPrecio(item.precio)}</span>
                          <button
                            className="btn btn-outline-danger eliminar-del-carrito-btn"
                            data-id={item.id}
                          >
                            <i className="bi bi-trash eliminar-del-carrito-btn"></i>
                          </button>
                        </h6>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary w-100 mt-4"
                type="button"
                onClick={comprar}
              >
                Finalizar compra
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
