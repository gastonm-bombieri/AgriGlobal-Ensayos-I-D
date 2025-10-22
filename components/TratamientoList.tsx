
import React from 'react';
import { TratamientoResultado } from '../types';
import { UnsyncedIcon } from './Icons';

interface TratamientoListProps {
  tratamientos: TratamientoResultado[];
}

const TratamientoList: React.FC<TratamientoListProps> = ({ tratamientos }) => {
  if (tratamientos.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay tratamientos registrados para este ensayo.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tratamiento</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tipo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Producto 1</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Variable 1</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Valor 1</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tratamientos.map((t) => (
            <tr key={t.ID_Tratamiento} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                    {!t.synced && <UnsyncedIcon className="w-4 h-4 text-red-500 mr-2" title="Pendiente de Sincronización"/>}
                    {t.Tratamiento}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.TipoTratamiento === 'Testigo' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                  {t.TipoTratamiento}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{t.Producto1 || '-'} {t.Dosis1 ? `(${t.Dosis1})` : ''}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{t.Variable1 || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{t.Valor1 ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TratamientoList;
