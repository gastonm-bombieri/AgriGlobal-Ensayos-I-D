
import React, { useState, useEffect, useRef } from 'react';
import { Ensayo } from '../types';
import { useEnsayos } from '../context/EnsayosContext';
import { CULTIVOS, LOCALIDADES, RESPONSABLES, ESTADOS, TIPOS_ENSAYO, PROVINCIAS } from '../constants';
import Modal from './Modal';
import { CameraIcon, LocationIcon, TrashIcon } from './Icons';

interface EnsayoFormProps {
  ensayoToEdit?: Ensayo | null;
  onClose: () => void;
}

const EnsayoForm: React.FC<EnsayoFormProps> = ({ ensayoToEdit, onClose }) => {
  const { addEnsayo, updateEnsayo } = useEnsayos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [locationStatus, setLocationStatus] = useState('');
  const [formData, setFormData] = useState({
    Año: new Date().getFullYear(),
    Localidad: '',
    Cultivo: '',
    Proyecto: '',
    Responsable: '',
    Tipo: 'Ensayo' as Ensayo['Tipo'],
    Provincia: '',
    Estado: 'Planificado' as Ensayo['Estado'],
    Fecha_Siembra: '',
    Fecha_Cosecha: '',
    Contacto: '',
    latitud: undefined as number | undefined,
    longitud: undefined as number | undefined,
    imagenes: [] as string[],
  });

  useEffect(() => {
    if (ensayoToEdit) {
      setFormData({
        Año: ensayoToEdit.Año,
        Localidad: ensayoToEdit.Localidad,
        Cultivo: ensayoToEdit.Cultivo,
        Proyecto: ensayoToEdit.Proyecto || '',
        Responsable: ensayoToEdit.Responsable,
        Tipo: ensayoToEdit.Tipo,
        Provincia: ensayoToEdit.Provincia,
        Estado: ensayoToEdit.Estado,
        Fecha_Siembra: ensayoToEdit.Fecha_Siembra || '',
        Fecha_Cosecha: ensayoToEdit.Fecha_Cosecha || '',
        Contacto: ensayoToEdit.Contacto || '',
        latitud: ensayoToEdit.latitud,
        longitud: ensayoToEdit.longitud,
        imagenes: ensayoToEdit.imagenes || [],
      });
    }
  }, [ensayoToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'Año' ? parseInt(value) : value }));
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocalización no es soportada por este navegador.');
      return;
    }
    setLocationStatus('Obteniendo ubicación...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        }));
        setLocationStatus(`Ubicación obtenida: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocationStatus('No se pudo obtener la ubicación.');
      }
    );
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
    if (event.target) {
        event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Año || !formData.Localidad || !formData.Cultivo || !formData.Responsable || !formData.Estado) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    
    const { latitud, longitud, imagenes, ...rest } = formData;
    const dataToSave = {
        ...rest,
        ...(latitud && { latitud }),
        ...(longitud && { longitud }),
        ...(imagenes.length > 0 && { imagenes }),
    };

    if (ensayoToEdit) {
      updateEnsayo(ensayoToEdit.ID_Ensayo, dataToSave);
    } else {
      addEnsayo(dataToSave as any);
    }
    onClose();
  };

  const renderField = (label: string, name: keyof typeof formData, type: string, required = false, options?: readonly string[] | {nombre: string}[]) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label} {required && '*'}</label>
          {type === 'select' ? (
              <select id={name} name={name} value={String(formData[name] || '')} onChange={handleChange} required={required} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#53a65e] focus:border-[#53a65e] sm:text-sm rounded-md">
                  <option value="">Seleccione...</option>
                  {options?.map(opt => {
                    const value = typeof opt === 'string' ? opt : opt.nombre;
                    return <option key={value} value={value}>{value}</option>
                  })}
              </select>
          ) : (
              <input type={type} id={name} name={name} value={String(formData[name] || '')} onChange={handleChange} required={required} className="mt-1 focus:ring-[#53a65e] focus:border-[#53a65e] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          )}
      </div>
  );

  return (
    <Modal title={ensayoToEdit ? 'Editar Ensayo' : 'Nuevo Ensayo'} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {renderField('Año', 'Año', 'number', true)}
                {renderField('Localidad', 'Localidad', 'select', true, LOCALIDADES)}
                {renderField('Cultivo', 'Cultivo', 'select', true, CULTIVOS)}
                {renderField('Responsable', 'Responsable', 'select', true, RESPONSABLES)}
                {renderField('Estado', 'Estado', 'select', true, ESTADOS)}
                {renderField('Tipo', 'Tipo', 'select', true, TIPOS_ENSAYO)}
                {renderField('Provincia', 'Provincia', 'select', false, PROVINCIAS)}
                {renderField('Proyecto', 'Proyecto', 'text')}
                {renderField('Fecha de Siembra', 'Fecha_Siembra', 'date')}
                {renderField('Fecha de Cosecha', 'Fecha_Cosecha', 'date')}
                {renderField('Contacto', 'Contacto', 'text')}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-4">
                  <button type="button" onClick={handleGetLocation} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]">
                    <LocationIcon className="w-5 h-5 mr-2" />
                    Ubicación
                  </button>
                  <p className="text-sm text-gray-600 flex-1">{locationStatus}</p>
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Latitud</label>
                      <input type="number" value={formData.latitud || ''} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Longitud</label>
                      <input type="number" value={formData.longitud || ''} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" />
                  </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700">Imágenes</label>
              <div className="flex items-center space-x-4">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} ref={cameraInputRef} className="hidden" />
                <button type="button" onClick={() => cameraInputRef.current?.click()} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]">
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Tomar Foto
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e]">
                  Adjuntar de Galería
                </button>
              </div>
              {formData.imagenes.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {formData.imagenes.map((imgSrc, index) => (
                    <div key={index} className="relative group">
                      <img src={imgSrc} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-4 sticky bottom-0">
                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#53a65e] text-base font-medium text-white hover:bg-[#43884d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53a65e] sm:ml-3 sm:w-auto sm:text-sm">
                    Guardar
                </button>
                <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancelar
                </button>
            </div>
        </form>
    </Modal>
  );
};

export default EnsayoForm;