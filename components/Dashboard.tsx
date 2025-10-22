
import React, { useState, useMemo, useCallback } from 'react';
import { useEnsayos } from '../context/EnsayosContext';
import { Ensayo } from '../types';
import EnsayoList from './EnsayoList';
import { SyncIcon, PlusIcon, SearchIcon, ExportIcon } from './Icons';
import { ESTADOS, PROVINCIAS } from '../constants';

interface DashboardProps {
  onSelectEnsayo: (ensayo: Ensayo) => void;
  onNewEnsayo: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectEnsayo, onNewEnsayo }) => {
  const { ensayos, simulateSync } = useEnsayos();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const unsyncedCount = useMemo(() => ensayos.filter(e => !e.synced).length, [ensayos]);
  
  const uniqueYears = useMemo(() => {
    const years = new Set(ensayos.map(e => e.Año));
    return Array.from(years).sort((a, b) => b - a);
  }, [ensayos]);

  const filteredEnsayos = useMemo(() => {
    return ensayos
      .filter(ensayo => statusFilter === 'all' || ensayo.Estado === statusFilter)
      .filter(ensayo => provinceFilter === 'all' || ensayo.Provincia === provinceFilter)
      .filter(ensayo => yearFilter === 'all' || ensayo.Año === parseInt(yearFilter, 10))
      .filter(ensayo => {
        if (!searchTerm) return true;
        const lowercasedFilter = searchTerm.toLowerCase();
        return (
          ensayo.ID_Ensayo.toLowerCase().includes(lowercasedFilter) ||
          ensayo.Localidad.toLowerCase().includes(lowercasedFilter) ||
          ensayo.Cultivo.toLowerCase().includes(lowercasedFilter) ||
          ensayo.Responsable.toLowerCase().includes(lowercasedFilter)
        );
      });
  }, [ensayos, searchTerm, statusFilter, provinceFilter, yearFilter]);

  const ensayosEnCurso = useMemo(() => {
      return ensayos.filter(e => e.Estado === 'En Curso').slice(0, 5);
  }, [ensayos]);

  const handleExportCSV = useCallback(() => {
    if (filteredEnsayos.length === 0) {
      alert("No hay ensayos para exportar.");
      return;
    }

    const headers = [
      "ID_Ensayo", "Año", "Localidad", "Cultivo", "Proyecto", "Responsable", 
      "Tipo", "Provincia", "Estado", "Fecha_Siembra", "Fecha_Cosecha", 
      "Contacto", "Cod_localidad", "Cod_cultivo", "Cod_numero", "synced"
    ];
    
    const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) {
            return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    const csvRows = [
      headers.join(','),
      ...filteredEnsayos.map(ensayo => 
        headers.map(header => escapeCSV(ensayo[header as keyof Ensayo])).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `ensayos_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredEnsayos]);


  const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
    <div className={`bg-white p-4 rounded-lg shadow`}>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className={`mt-1 text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Panel de Control
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
                onClick={simulateSync}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]"
            >
                <SyncIcon className="w-5 h-5 mr-2"/>
                Sincronizar
                {unsyncedCount > 0 && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{unsyncedCount}</span>}
            </button>
            <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]"
            >
                <ExportIcon className="w-5 h-5 mr-2"/>
                Exportar a CSV
            </button>
          <button
            onClick={onNewEnsayo}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#53a65e] hover:bg-[#43884d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nuevo Ensayo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard title="Total Ensayos" value={ensayos.length} color="text-[#153f38]" />
        <StatCard title="En Curso" value={ensayos.filter(e => e.Estado === 'En Curso').length} color="text-yellow-600" />
        <StatCard title="Completados" value={ensayos.filter(e => e.Estado === 'Completado').length} color="text-blue-600" />
      </div>

      {ensayosEnCurso.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Ensayos en Curso (Acceso Rápido)</h3>
              <div className="mt-4">
                  <EnsayoList ensayos={ensayosEnCurso} onSelectEnsayo={onSelectEnsayo} />
              </div>
          </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Todos los Ensayos</h3>
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                id="status-filter"
                name="status-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#53a65e] focus:border-[#53a65e] sm:text-sm rounded-md"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                {ESTADOS.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="province-filter" className="block text-sm font-medium text-gray-700">Provincia</label>
              <select
                id="province-filter"
                name="province-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#53a65e] focus:border-[#53a65e] sm:text-sm rounded-md"
                value={provinceFilter}
                onChange={e => setProvinceFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                {PROVINCIAS.map(province => <option key={province} value={province}>{province}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700">Año</label>
              <select
                id="year-filter"
                name="year-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#53a65e] focus:border-[#53a65e] sm:text-sm rounded-md"
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
          <div className="relative rounded-md shadow-sm mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, Localidad, Cultivo o Responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-[#53a65e] focus:border-[#53a65e] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <EnsayoList ensayos={filteredEnsayos} onSelectEnsayo={onSelectEnsayo} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
