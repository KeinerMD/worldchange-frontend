import React, {useState, useEffect} from 'react';
import axios from 'axios';

const API = (import.meta.env.VITE_API_URL) || 'http://localhost:4000/api';

function VerifyWorldID({onVerified}) {
  const simulate = () => {
    // simulate a World ID hash
    const fake = 'worldid_' + Math.random().toString(36).substring(2,9);
    onVerified(fake);
  };
  return (
    <div className="card">
      <h3>Verificación (Demo)</h3>
      <p>Simula verificación con World ID para operar en modo demo.</p>
      <button className="btn primary" onClick={simulate}>Simular World ID</button>
    </div>
  );
}

function OrderForm({ worldIdHash, onCreated }) {
  const [type, setType] = useState('SELL');
  const [amountWld, setAmountWld] = useState('');
  const [amountCop, setAmountCop] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    await axios.post(API + '/orders', { world_id_hash: worldIdHash, type, amount_wld: amountWld, amount_cop: amountCop });
    setAmountWld(''); setAmountCop('');
    onCreated();
  };
  return (
    <div className="card">
      <h3>Publicar orden</h3>
      <form onSubmit={submit} className="form">
        <label>Tipo
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="SELL">Vendo WLD (recibo COP)</option>
            <option value="BUY">Compro WLD (pago COP)</option>
          </select>
        </label>
        <label>Cantidad WLD
          <input required value={amountWld} onChange={e=>setAmountWld(e.target.value)} />
        </label>
        <label>Equivalente COP
          <input required value={amountCop} onChange={e=>setAmountCop(e.target.value)} />
        </label>
        <button className="btn">Publicar</button>
      </form>
      <p className="muted">Modo demo: pagos simulados. En producción esto mostrará la cuenta del operador.</p>
    </div>
  );
}

function OrderList({ apiUrl }) {
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    const res = await axios.get(apiUrl + '/orders');
    setOrders(res.data);
  };
  useEffect(()=>{ fetchOrders(); }, []);
  const claim = async (id) => {
    await axios.put(apiUrl + '/' + id, { status: 'AWAITING_PAYMENT' });
    alert('Orden marcada AWAITING_PAYMENT. Siga las instrucciones (demo).');
    fetchOrders();
  };
  return (
    <div className="card">
      <h3>Órdenes</h3>
      {orders.length===0 ? <p>No hay órdenes.</p> : (
        <ul className="orders">
          {orders.map(o=>(
            <li key={o.id} className="order">
              <div>
                <strong>{o.type === 'SELL' ? 'Vende' : 'Compra'}</strong>
                <div>{o.amount_wld} WLD — {o.amount_cop} COP</div>
                <div className="small">Estado: {o.status}</div>
              </div>
              <div className="actions">
                <button className="btn" onClick={()=>claim(o.id)}>Seleccionar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App(){
  const [worldIdHash, setWorldIdHash] = useState(null);
  const apiUrl = (import.meta.env.VITE_API_URL) || 'http://localhost:4000/api';
  return (
    <div className="container">
      <header className="header">
        <h1>World Chain — Demo (Colombia)</h1>
        <p>Compra y vende WLD de forma simple (modo demo)</p>
      </header>
      <main>
        {!worldIdHash && <VerifyWorldID onVerified={setWorldIdHash} />}
        {worldIdHash && <div className="card"><p>World ID verificado: <strong>{worldIdHash}</strong></p></div>}
        {worldIdHash && <OrderForm worldIdHash={worldIdHash} onCreated={()=>{}} />}
        <OrderList apiUrl={apiUrl} />
      </main>
      <footer className="muted center">Demo — no usar con dinero real</footer>
    </div>
  );
}
