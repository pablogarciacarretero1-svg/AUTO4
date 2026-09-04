import React, { useState } from 'react';
import { 
  Car, Users, CheckSquare, TrendingUp, Plus, Search, 
  FileText, Download, Upload, Filter, Calendar, MapPin, 
  Phone, Mail, CheckCircle2, Clock, ShieldAlert, ArrowRight, Eye, Trash2
} from 'lucide-react';

// Base de Datos de Marcas y Modelos Europeos
const EUROPEAN_BRANDS = {
  "Audi": ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "e-tron"],
  "BMW": ["Serie 1", "Serie 3", "Serie 5", "X1", "X3", "X5", "i4", "M3"],
  "Mercedes-Benz": ["Clase A", "Clase C", "Clase E", "CLA", "GLC", "GLE", "EQE"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "T-Roc", "ID.4"],
  "Porsche": ["911", "Cayenne", "Macan", "Taycan", "Panamera"],
  "Peugeot": ["208", "308", "3008", "5008", "2008"],
  "Renault": ["Clio", "Megane", "Captur", "Austral", "Zoe"],
  "Seat / Cupra": ["Ibiza", "Leon", "Ateca", "Formentor", "Born"],
  "Fiat": ["500", "Panda", "Tipo", "Ducato"]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado Inicial
  const [stock, setStock] = useState([
    {
      id: 1,
      brand: 'Mercedes-Benz',
      model: 'CLA',
      version: '220d AMG Line',
      vin: 'WDD1173081N123456',
      firstRegistration: '2019-05-15',
      emissions: '125 g/km (Euro 6)',
      doors: 5,
      km: 85000,
      engineCc: '2.0 CDTI',
      transmission: 'Automático',
      color: 'Gris Montaña',
      notes: 'Historial completo de mantenimiento. Perfecto estado.',
      costPrice: 18000,
      expenses: 1500,
      profitMargin: 3500,
      status: 'Disponible',
      images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80']
    }
  ]);

  const [clients, setClients] = useState([
    {
      id: 1,
      type: 'Persona Física',
      firstName: 'Carlos',
      lastName: 'Gómez Martín',
      companyName: '',
      taxId: '12345678Z',
      administrator: '',
      addressStreet: 'Calle Mayor 12',
      addressZip: '39300',
      addressCity: 'Torrelavega',
      addressProvince: 'Cantabria',
      phone: '600112233',
      email: 'carlos.gomez@email.com',
      attachments: ['DNI_Frontal.pdf', 'DNI_Trasero.pdf']
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Revisión mecánica Mercedes CLA',
      description: 'Pasar revisión de los 85.000 km y cambio de aceite.',
      priority: 'Alta',
      status: 'Pendiente',
      createdAt: '2026-09-01',
      resolutionReport: ''
    }
  ]);

  const [sales, setSales] = useState([]);

  // Control de Modales
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCloseSale, setShowCloseSale] = useState(false);
  const [selectedTaskForComplete, setSelectedTaskForComplete] = useState(null);
  const [selectedSaleDetail, setSelectedSaleDetail] = useState(null);
  const [resolutionInput, setResolutionInput] = useState('');

  // Formularios
  const [newVehicle, setNewVehicle] = useState({
    brand: '', model: '', vin: '', firstRegistration: '', emissions: '',
    doors: 5, km: 0, engineCc: '', transmission: 'Manual', color: '',
    notes: '', costPrice: 0, expenses: 0, profitMargin: 0, images: []
  });

  const [newClient, setNewClient] = useState({
    type: 'Persona Física', firstName: '', lastName: '', companyName: '',
    taxId: '', administrator: '', addressStreet: '', addressZip: '',
    addressCity: '', addressProvince: '', phone: '', email: '', attachments: []
  });

  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'Media'
  });

  const [newSale, setNewSale] = useState({
    vehicleId: '', clientId: '', saleDate: new Date().toISOString().split('T')[0], saleDocuments: []
  });

  // Cálculos Automáticos
  const pendingTasks = tasks.filter(t => t.status === 'Pendiente');
  const completedTasks = tasks.filter(t => t.status === 'Completada');
  const availableStock = stock.filter(v => v.status === 'Disponible');
  
  const currentMonthProfit = sales
    .filter(s => new Date(s.saleDate).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.profitRealized, 0);

  // Handlers
  const handleAddVehicle = (e) => {
    e.preventDefault();
    const totalPrice = Number(newVehicle.costPrice) + Number(newVehicle.expenses) + Number(newVehicle.profitMargin);
    setStock([...stock, { ...newVehicle, id: Date.now(), status: 'Disponible', totalPrice }]);
    setShowAddVehicle(false);
    setNewVehicle({ brand: '', model: '', vin: '', firstRegistration: '', emissions: '', doors: 5, km: 0, engineCc: '', transmission: 'Manual', color: '', notes: '', costPrice: 0, expenses: 0, profitMargin: 0, images: [] });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    setClients([...clients, { ...newClient, id: Date.now() }]);
    setShowAddClient(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'Pendiente', createdAt: new Date().toISOString().split('T')[0], resolutionReport: '' }]);
    setShowAddTask(false);
  };

  const handleCompleteTask = (e) => {
    e.preventDefault();
    setTasks(tasks.map(t => t.id === selectedTaskForComplete.id ? { ...t, status: 'Completada', resolutionReport: resolutionInput, completedAt: new Date().toISOString().split('T')[0] } : t));
    setSelectedTaskForComplete(null);
    setResolutionInput('');
  };

  const handleRegisterSale = (e) => {
    e.preventDefault();
    const vehicle = stock.find(v => v.id === Number(newSale.vehicleId));
    const client = clients.find(c => c.id === Number(newSale.clientId));
    if (!vehicle || !client) return;

    const saleRecord = {
      id: Date.now(),
      vehicle,
      client,
      saleDate: newSale.saleDate,
      finalPrice: Number(vehicle.costPrice) + Number(vehicle.expenses) + Number(vehicle.profitMargin),
      profitRealized: Number(vehicle.profitMargin),
      saleDocuments: newSale.saleDocuments
    };

    setSales([...sales, saleRecord]);
    setStock(stock.map(v => v.id === vehicle.id ? { ...v, status: 'Vendido' } : v));
    setShowCloseSale(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Car className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-black tracking-wider text-white">AUTO4</h1>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'stock', name: 'Stock', icon: Car },
              { id: 'clients', name: 'Clientes', icon: Users },
              { id: 'tasks', name: 'Tareas', icon: CheckSquare },
              { id: 'sales', name: 'Ventas', icon: FileText }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 text-center">
          AUTO4 CRM System v2.0
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Panel Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Coches en Stock</span>
                  <Car className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold">{availableStock.length}</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Clientes Totales</span>
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-extrabold">{clients.length}</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Beneficio Ganado (Mes)</span>
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">{currentMonthProfit.toLocaleString()} €</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Tareas Pendientes</span>
                  <CheckSquare className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold">{pendingTasks.length}</div>
              </div>
            </div>

            {/* Banner Mensaje Tareas Vacías */}
            {pendingTasks.length === 0 && (
              <div className="bg-gradient-to-r from-emerald-900/40 to-slate-800 border border-emerald-500/30 p-6 rounded-xl flex items-center gap-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-emerald-300">¡Buen trabajo, no hay tareas pendientes!</h3>
                  <p className="text-sm text-slate-400">Todos los trámites y revisiones del taller se encuentran al día.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STOCK */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Stock</h2>
              <button 
                onClick={() => setShowAddVehicle(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Añadir Vehículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableStock.map(v => (
                <div key={v.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
                  <img src={v.images[0] || 'https://via.placeholder.com/400x250'} alt={`${v.brand} ${v.model}`} className="w-full h-48 object-cover" />
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">{v.brand}</span>
                      <h3 className="text-xl font-bold">{v.model} <span className="text-sm text-slate-400">{v.version}</span></h3>
                    </div>
                    
                    <div className="text-xs text-slate-400 grid grid-cols-2 gap-2 border-y border-slate-700 py-2">
                      <div>Matriculación: <span className="text-slate-200 font-semibold">{v.firstRegistration}</span></div>
                      <div>Kilómetros: <span className="text-slate-200 font-semibold">{v.km.toLocaleString()} km</span></div>
                      <div>Bastidor: <span className="text-slate-200 font-semibold">{v.vin}</span></div>
                      <div>Cambio: <span className="text-slate-200 font-semibold">{v.transmission}</span></div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <div className="text-xs text-slate-400">Precio Total</div>
                        <div className="text-2xl font-black text-white">{v.totalPrice?.toLocaleString()} €</div>
                      </div>
                      <button 
                        onClick={() => alert(`Generando PDF de oferta para ${v.brand} ${v.model}...`)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-lg flex items-center gap-1 text-xs font-medium"
                      >
                        <Download className="h-4 w-4" /> Oferta PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENTES */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Directorio de Clientes</h2>
              <button 
                onClick={() => setShowAddClient(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Nuevo Cliente
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map(c => (
                <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded">{c.type}</span>
                      <h3 className="text-xl font-bold mt-2">{c.type === 'Empresa' ? c.companyName : `${c.firstName} ${c.lastName}`}</h3>
                      <p className="text-xs text-slate-400">NIF/CIF: {c.taxId}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-300 border-t border-slate-700 pt-3">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> {c.addressStreet}, {c.addressZip} {c.addressCity} ({c.addressProvince})</div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" /> {c.phone}</div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> {c.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAREAS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Tareas</h2>
              <button 
                onClick={() => setShowAddTask(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Nueva Tarea
              </button>
            </div>

            <div className="space-y-4">
              {pendingTasks.map(t => (
                <div key={t.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${t.priority === 'Alta' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'}`}>{t.priority}</span>
                      <h4 className="font-bold">{t.title}</h4>
                    </div>
                    <p className="text-sm text-slate-400">{t.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTaskForComplete(t)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Marcar Completada
                  </button>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  ¡Buen trabajo, no hay tareas pendientes!
                </div>
              )}
            </div>
          </div>
        )}

        {/* VENTAS */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Histórico de Ventas</h2>
              <button 
                onClick={() => setShowCloseSale(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Registrar Nueva Venta
              </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400">
                  <tr>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Vehículo</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Precio Venta</th>
                    <th className="p-4">Ganancia</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-700/30">
                      <td className="p-4 font-medium">{s.saleDate}</td>
                      <td className="p-4 font-bold">{s.vehicle.brand} {s.vehicle.model}</td>
                      <td className="p-4">{s.client.type === 'Empresa' ? s.client.companyName : `${s.client.firstName} ${s.client.lastName}`}</td>
                      <td className="p-4 font-bold text-white">{s.finalPrice.toLocaleString()} €</td>
                      <td className="p-4 font-bold text-emerald-400">+{s.profitRealized.toLocaleString()} €</td>
                      <td className="p-4">
                        <button 
                          onClick={() => setSelectedSaleDetail(s)}
                          className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg text-xs"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">No hay registros de ventas guardados todavía.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL CERRAR TAREA CON REPORTE */}
      {selectedTaskForComplete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Completar Tarea</h3>
            <p className="text-sm text-slate-400">{selectedTaskForComplete.title}</p>
            
            <form onSubmit={handleCompleteTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Reporte de cómo ha sido subsanada (Obligatorio)</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                  placeholder="Detalla la solución o trabajo realizado..."
                  value={resolutionInput}
                  onChange={(e) => setResolutionInput(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedTaskForComplete(null)} className="px-4 py-2 bg-slate-700 rounded-lg text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">Guardar y Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA VENTA */}
      {showCloseSale && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg">Registrar Venta de Vehículo</h3>
            <form onSubmit={handleRegisterSale} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Seleccionar Vehículo</label>
                <select 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                  value={newSale.vehicleId}
                  onChange={(e) => setNewSale({ ...newSale, vehicleId: e.target.value })}
                >
                  <option value="">Selecciona Coche...</option>
                  {availableStock.map(v => (
                    <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.totalPrice?.toLocaleString()} €</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Seleccionar Cliente</label>
                <select 
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                  value={newSale.clientId}
                  onChange={(e) => setNewSale({ ...newSale, clientId: e.target.value })}
                >
                  <option value="">Selecciona Cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.type === 'Empresa' ? c.companyName : `${c.firstName} ${c.lastName}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Fecha de Venta</label>
                <input 
                  type="date"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                  value={newSale.saleDate}
                  onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCloseSale(false)} className="px-4 py-2 bg-slate-700 rounded-lg text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">Confirmar Venta</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
