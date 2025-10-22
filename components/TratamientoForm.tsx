
import React, { useState } from 'react';
import { TratamientoResultado } from '../types';
import { useEnsayos } from '../context/EnsayosContext';
import { TIPOS_TRATAMIENTO } from '../constants';
import Modal from './Modal';

interface TratamientoFormProps {
  ensayoId: string;
  tratamientoToEdit?: TratamientoResultado | null;
  onClose: () => void;
}

const TratamientoForm: React.FC<TratamientoFormProps> = ({ ensayoId, tratamientoToEdit, onClose }) => {
  const { addTratamiento, updateTratamiento } = useEnsayos();
  const [formData, setFormData] = useState({
    TipoTratamiento: 'Tratado' as TratamientoResultado['TipoTratamiento'],
    Tratamiento: '',
    Producto1: '', Dosis1: '',
    Producto2: '', Dosis2: '',
    Producto3: '', Dosis3: '',
    Variable1: '', Valor1: '',
    Variable2: '', Valor2: '',
    Variable3: '', Valor3: '',
  });

  // Simplified form for prototype
  // In a real app, this would be more complex with dynamic fields

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Tratamiento || !formData.TipoTratamiento) {
      alert('Por favor, complete Tratamiento y Tipo de Tratamiento.');
      return;
    }

    const dataToSave = {
      ID_Ensayo_FK: ensayoId,
      TipoTratamiento: formData.TipoTratamiento,
      Tratamiento: formData.Tratamiento,
      Producto1: formData.Producto1 || undefined,
      Dosis1: formData.Dosis1 ? parseFloat(formData.Dosis1) : undefined,
      Variable1: formData.Variable1 || undefined,
      Valor1: formData.Valor1 ? parseFloat(formData.Valor1) : undefined,
    };

    if (tratamientoToEdit) {
      updateTratamiento(tratamientoToEdit.ID_Tratamiento, dataToSave);
    } else {
      addTratamiento(dataToSave);
    }
    onClose();
  };

  const renderField = (label: string, name: keyof typeof formData, type: string, options?: readonly string[]) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'select' ? (
            <select id={name} name={name} value={formData[name]} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#53a65e] focus:border-[#53a65e] sm:text-sm rounded-md">
                {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input type={type} id={name} name={name} value={formData[name]} onChange={handleChange} className="mt-1 focus:ring-[#53a65e] focus:border-[#53a65e] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        )}
    </div>
  );

  return (
    <Modal title={tratamientoToEdit ? 'Editar Tratamiento' : 'Añadir Tratamiento'} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {renderField('Tipo de Tratamiento', 'TipoTratamiento', 'select', TIPOS_TRATAMIENTO)}
                <div className="sm:col-span-2">{renderField('Descripción Tratamiento', 'Tratamiento', 'text')}</div>
                {renderField('Producto 1', 'Producto1', 'text')}
                {renderField('Dosis 1', 'Dosis1', 'number')}
                {renderField('Variable 1', 'Variable1', 'text')}
                {renderField('Valor 1', 'Valor1', 'number')}
            </div>
             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-4">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#53a65e] text-base font-medium text-white hover:bg-[#43884d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e] sm:ml-3 sm:w-auto sm:text-sm">
                    Guardar Tratamiento
                </button>
                <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancelar
                </button>
            </div>
        </form>
    </Modal>
  );
};

export default TratamientoForm;