import { useEffect, useState } from "react"
import { Carrito } from "../components/Carrito"
import { CardJuego } from "../components/CardJuego"
import { obtenerJuegos } from '../services/juegosService'


export function Catalago() {
    const [carrito, setCarrito] = useState([])
    const [productos, setProductos] = useState([])

    useEffect(() => {
        obtenerJuegos().then((respuesta) => setProductos(respuesta))
    }, [])

    const agregarAlCarrito = (productoId) => {
        const producto = productos[productoId];
        // Lista con todos los productos que tenía el carrito más uno nuevo
        const carritoActualizado = [...carrito, producto]
        setCarrito(carritoActualizado)
        console.log(`Producto agregado al carrito: ${producto.nombre}`);
        const toastCarrito = document.getElementById('toast-carrito')
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastCarrito)
        toastBootstrap.show()
    }

    return (
        <>
            <main id="tienda">
                <div className="container">
                    <section id="encabezado-tienda">
                        <div className="hero-copy text-center my-4">
                            <h1>Encuentra <em>los mejores juegos</em> aquí.</h1>
                        </div>
                    </section>
                    <section id="catalogo">
                        <div className="row align-items-stretch my-4">
                            {Object.values(productos).map(
                                (producto) => <CardJuego juego={producto} agregarAlCarrito={agregarAlCarrito} />)}
                        </div>
                    </section>
                </div>
            </main>

            <Carrito carrito={carrito} />

            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="toast-carrito" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-body d-flex flex-grow text-bg-primary">
                        Producto agregado al carrito.
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>

                </div>
            </div>
        </>
    )
}