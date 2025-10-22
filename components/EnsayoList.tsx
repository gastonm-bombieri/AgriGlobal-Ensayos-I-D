
import React from 'react';
import { Ensayo } from '../types';
import { UnsyncedIcon } from './Icons';

interface EnsayoListProps {
  ensayos: Ensayo[];
  onSelectEnsayo: (ensayo: Ensayo) => void;
}

const EnsayoList: React.FC<EnsayoListProps> = ({ ensayos, onSelectEnsayo }) => {

  const getStatusColor = (status: Ensayo['Estado']) => {
    switch (status) {
      case 'Completado': return 'bg-blue-100 text-blue-800';
      case 'En Curso': return 'bg-yellow-100 text-yellow-800';
      case 'Planificado': return 'bg-indigo-100 text-indigo-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (ensayos.length === 0) {
    return <div className="text-center py-8 text-gray-500">No se encontraron ensayos.</div>
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Ensayo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Localidad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Cultivo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ensayos.map((ensayo) => (
                  <tr key={ensayo.ID_Ensayo} onClick={() => onSelectEnsayo(ensayo)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                            {!ensayo.synced && <UnsyncedIcon className="w-4 h-4 text-red-500 mr-2" title="Pendiente de Sincronización"/>}
                            {ensayo.ID_Ensayo}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{ensayo.Localidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{ensayo.Cultivo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ensayo.Estado)}`}>
                        {ensayo.Estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnsayoList;
