import { formatearPrecio } from '../utils/formatters';

export function CardJuego(props) {
    const juego = props.juego;
    const agregarAlCarrito = props.agregarAlCarrito;
    return (
        <div className="col-12 col-sm-6 col-md-4 d-flex">
            <div className="card">
                <img
                    src={juego.imagen}
                    className="card-img-top"
                    alt={juego.nombre}
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {juego.nombre}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">
                        {formatearPrecio(juego.precio)}
                    </h6>
                    <p className="card-text">
                        {juego.descripcion}
                    </p>
                    <button className="btn btn-primary add-to-cart-btn" onClick={() => agregarAlCarrito(juego.id)}>Agregar al carrito</button>
                </div>
            </div>
        </div>
    )
}
