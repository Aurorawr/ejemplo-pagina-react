import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { confirmarPago } from '../services/comprasService';

export function CompraRealizada() {
  const [searchParams] = useSearchParams();
  // Estados posibles: 'CARGANDO' | 'APROBADO' | 'RECHAZADO' | 'ANULADO_USUARIO' | 'TIMEOUT' | 'ERROR_ABORTADO'
  const [estado, setEstado] = useState('CARGANDO');
  const [comprobante, setComprobante] = useState(null);
  const [mensajeError, setMensajeError] = useState('');

  // Evita doble llamada a tx.commit() en desarrollo por React.StrictMode
  const procesadoRef = useRef(false);

  useEffect(() => {
    if (procesadoRef.current) return;
    procesadoRef.current = true;

    const tokenWs = searchParams.get('token_ws');
    const tbkToken = searchParams.get('TBK_TOKEN');
    const tbkOrdenCompra = searchParams.get('TBK_ORDEN_COMPRA');
    const tbkIdSesion = searchParams.get('TBK_ID_SESION');

    const procesarRetorno = async () => {
      // CASO 1: Flujo normal (Aprobado o Rechazado por el banco) -> Solo viene token_ws
      if (tokenWs && !tbkToken) {
        try {
          const data = await confirmarPago(tokenWs)

          // Aprobado solo cuando status es AUTHORIZED y response_code es 0
          if (data.status === 'AUTHORIZED' && data.response_code === 0) {
            setComprobante(data);
            setEstado('APROBADO');
          } else {
            setComprobante(data);
            setEstado('RECHAZADO');
          }
        } catch (error) {
          console.error(error);
          setMensajeError('No pudimos verificar el estado de tu transacción. Si se realizó un cargo, contáctanos.');
          setEstado('ERROR_ABORTADO');
        }
        return;
      }

      // CASO 2: Usuario anuló la compra en Webpay -> Vienen TBK_TOKEN, TBK_ORDEN_COMPRA y TBK_ID_SESION
      if (tbkToken && !tokenWs) {
        setEstado('ANULADO_USUARIO');
        return;
      }

      // CASO 3: Timeout en Webpay -> Vienen TBK_ORDEN_COMPRA y TBK_ID_SESION sin tokens
      if (tbkOrdenCompra && tbkIdSesion && !tokenWs && !tbkToken) {
        setEstado('TIMEOUT');
        return;
      }

      // CASO 4: Error anómalo (ambos tokens) o acceso directo a la URL sin parámetros
      setMensajeError('La transacción fue abortada o el enlace de retorno no es válido.');
      setEstado('ERROR_ABORTADO');
    };

    procesarRetorno();
  }, [searchParams]);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* ESTADO: CARGANDO */}
          {estado === 'CARGANDO' && (
            <div className="card shadow-sm text-center p-5">
              <div className="card-body">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h4 className="card-title">Confirmando tu pago...</h4>
                <p className="text-muted mb-0">
                  Por favor, no cierres ni recargues esta ventana mientras validamos con el banco.
                </p>
              </div>
            </div>
          )}

          {/* ESTADO: APROBADO */}
          {estado === 'APROBADO' && comprobante && (
            <div className="card border-success shadow-sm">
              <div className="card-header bg-success text-white text-center py-3">
                <h4 className="mb-0">¡Pago Aprobado!</h4>
              </div>
              <div className="card-body p-4">
                <p className="text-center text-muted mb-4">
                  Tu compra se ha procesado correctamente.
                </p>
              </div>
            </div>
          )}

          {/* ESTADO: RECHAZADO */}
          {estado === 'RECHAZADO' && (
            <div className="card border-danger shadow-sm">
              <div className="card-header bg-danger text-white text-center py-3">
                <h4 className="mb-0">Pago Rechazado</h4>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-danger" role="alert">
                  La transacción no fue autorizada por tu banco o emisor de tarjeta.
                </div>
                <p className="fw-semibold mb-2">Posibles causas:</p>
                <ul className="text-muted mb-4">
                  <li>Saldo o cupo insuficiente en la tarjeta.</li>
                  <li>Error al ingresar los datos o clave de seguridad.</li>
                  <li>Tarjeta bloqueada o no habilitada para compras en línea.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ESTADO: ANULADO POR EL USUARIO */}
          {estado === 'ANULADO_USUARIO' && (
            <div className="card border-warning shadow-sm">
              <div className="card-header bg-warning text-dark text-center py-3">
                <h4 className="mb-0">Compra Anulada</h4>
              </div>
              <div className="card-body p-4 text-center">
                <p className="mb-4">
                  Has cancelado el proceso de pago en Webpay. No se ha realizado ningún cargo a tu tarjeta.
                </p>
              </div>
            </div>
          )}

          {/* ESTADO: TIMEOUT */}
          {estado === 'TIMEOUT' && (
            <div className="card border-warning shadow-sm">
              <div className="card-header bg-warning text-dark text-center py-3">
                <h4 className="mb-0">Tiempo Expirado</h4>
              </div>
              <div className="card-body p-4 text-center">
                <p className="mb-4">
                  El tiempo máximo para completar el pago en Webpay ha expirado por seguridad.
                </p>
                <div className="d-grid">
                </div>
              </div>
            </div>
          )}

          {/* ESTADO: ERROR / ABORTADO */}
          {estado === 'ERROR_ABORTADO' && (
            <div className="card border-danger shadow-sm">
              <div className="card-header bg-danger text-white text-center py-3">
                <h4 className="mb-0">Problema con la Transacción</h4>
              </div>
              <div className="card-body p-4 text-center">
                <p className="text-danger mb-4">{mensajeError}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}