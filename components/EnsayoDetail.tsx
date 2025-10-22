
import React, { useState } from 'react';
import { Ensayo } from '../types';
import { useEnsayos } from '../context/EnsayosContext';
import TratamientoList from './TratamientoList';
import TratamientoForm from './TratamientoForm';
import { BackIcon, EditIcon, PlusIcon, UnsyncedIcon, LocationIcon } from './Icons';

interface EnsayoDetailProps {
  ensayo: Ensayo;
  onBack: () => void;
  onEditEnsayo: (ensayoId: string) => void;
}

const EnsayoDetail: React.FC<EnsayoDetailProps> = ({ ensayo, onBack, onEditEnsayo }) => {
  const { getTratamientosByEnsayoId } = useEnsayos();
  const [isTratamientoFormOpen, setIsTratamientoFormOpen] = useState(false);
  
  const tratamientos = getTratamientosByEnsayoId(ensayo.ID_Ensayo);

  const getStatusColor = (status: Ensayo['Estado']) => {
    switch (status) {
      case 'Completado': return 'bg-blue-100 text-blue-800';
      case 'En Curso': return 'bg-yellow-100 text-yellow-800';
      case 'Planificado': return 'bg-indigo-100 text-indigo-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DetailItem: React.FC<{ label: string, value?: React.ReactNode }> = ({ label, value }) => (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
          <BackIcon className="w-5 h-5 mr-2" />
          Volver al Panel
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              Detalle del Ensayo
              {!ensayo.synced && <UnsyncedIcon className="w-5 h-5 text-red-500 ml-2" title="Pendiente de Sincronización"/>}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{ensayo.ID_Ensayo}</p>
          </div>
          <button
            onClick={() => onEditEnsayo(ensayo.ID_Ensayo)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]"
          >
            <EditIcon className="w-5 h-5 mr-2"/>
            Editar
          </button>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6">
              <DetailItem label="Estado" value={<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ensayo.Estado)}`}>{ensayo.Estado}</span>} />
            </div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Año" value={ensayo.Año} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Localidad" value={ensayo.Localidad} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Cultivo" value={ensayo.Cultivo} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Responsable" value={ensayo.Responsable} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Tipo" value={ensayo.Tipo} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Provincia" value={ensayo.Provincia} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Fecha Siembra" value={ensayo.Fecha_Siembra} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Fecha Cosecha" value={ensayo.Fecha_Cosecha} /></div>
            <div className="sm:col-span-1 p-4 sm:py-5 sm:px-6"><DetailItem label="Proyecto" value={ensayo.Proyecto} /></div>
            <div className="sm:col-span-2 p-4 sm:py-5 sm:px-6"><DetailItem label="Contacto" value={ensayo.Contacto} /></div>
             {ensayo.latitud && ensayo.longitud && (
              <div className="sm:col-span-3 p-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={`https://www.google.com/maps?q=${ensayo.latitud},${ensayo.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#53a65e] hover:text-[#153f38] inline-flex items-center"
                  >
                    <LocationIcon className="w-5 h-5 mr-2" />
                    Ver en Mapa ({ensayo.latitud.toFixed(5)}, {ensayo.longitud.toFixed(5)})
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {ensayo.imagenes && ensayo.imagenes.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Imágenes Adjuntas</h3>
              </div>
              <div className="border-t border-gray-200 p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {ensayo.imagenes.map((imgSrc, index) => (
                          <a href={imgSrc} target="_blank" rel="noopener noreferrer" key={index} className="group">
                              <img src={imgSrc} alt={`Imagen del ensayo ${index + 1}`} className="w-full h-32 object-cover rounded-md shadow-md group-hover:shadow-lg group-hover:opacity-90 transition-all" />
                          </a>
                      ))}
                  </div>
              </div>
          </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tratamientos y Resultados</h3>
            <button
                onClick={() => setIsTratamientoFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#53a65e] hover:bg-[#43884d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Añadir Tratamiento
            </button>
        </div>
        <div className="border-t border-gray-200">
          <TratamientoList tratamientos={tratamientos} />
        </div>
      </div>
      {isTratamientoFormOpen && <TratamientoForm ensayoId={ensayo.ID_Ensayo} onClose={() => setIsTratamientoFormOpen(false)} />}
    </div>
  );
};

export default EnsayoDetail;