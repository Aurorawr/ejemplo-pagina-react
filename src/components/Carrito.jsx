
export function Carrito(props) {
    const carrito = props.carrito;
    return (
        <aside id="contenido-carrito">
            <div className="offcanvas offcanvas-end" tabindex="-1" id="carrito" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Tu carrito</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul id="items-carrito" className="list-group">
                        {carrito.length == 0 ? (
                            <li class="list-group-item">Tu carrito está vacío.</li>
                        ) : (
                            carrito.map((item) => <li class="list-group-item">
                                <div class="card">
                                    <img
                                        src={item.imagen}
                                        class="card-img-top"
                                        alt={item.nombre}
                                    />
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            {item.nombre}
                                        </h5>
                                        <h6 class="card-subtitle mb-2 text-body-secondary d-flex align-items-center">
                                            <span class="flex-fill">{item.precio}</span>
                                            <button class="btn btn-outline-danger eliminar-del-carrito-btn" data-id={item.id}><i class="bi bi-trash eliminar-del-carrito-btn"></i></button>
                                        </h6>
                                    </div>
                                </div>
                            </li>)
                        )}
                    </ul>
                    <a href="compra.html" className="btn btn-primary w-100 mt-4" type="button">Finalizar compra</a>
                </div>
            </div>
        </aside>
    );
}
