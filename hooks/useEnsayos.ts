
import { useState, useEffect, useCallback } from 'react';
import { Ensayo, TratamientoResultado } from '../types';
import { CULTIVOS, LOCALIDADES } from '../constants';

const initialEnsayos: Ensayo[] = [
    { "ID_Ensayo": "2023-BCE-TR-038", "Año": 2023, "Localidad": "Balcarce", "Cultivo": "Trigo", "Responsable": "Agrar del Sur", "Tipo": "Ensayo", "Provincia": "Buenos Aires", "Estado": "Completado", "Fecha_Siembra": "2023-06-28", "Cod_localidad": "BCE", "Cod_cultivo": "TR", "Cod_numero": 38, synced: true },
    { "ID_Ensayo": "2024-OR-CB-107", "Año": 2024, "Localidad": "Orense", "Cultivo": "Cebada", "Responsable": "Rocio Dominguez", "Tipo": "Ensayo", "Provincia": "Buenos Aires", "Estado": "En Curso", "Fecha_Siembra": "2024-07-19", "Cod_localidad": "OR", "Cod_cultivo": "CB", "Cod_numero": 107, synced: true },
    { "ID_Ensayo": "2024-SL-TR-117", "Año": 2024, "Localidad": "Saladillo", "Cultivo": "Trigo", "Responsable": "Rocio Dominguez", "Tipo": "Ensayo", "Provincia": "Buenos Aires", "Estado": "En Curso", "Fecha_Siembra": "2024-06-04", "Cod_localidad": "SL", "Cod_cultivo": "TR", "Cod_numero": 117, synced: false },
    { "ID_Ensayo": "2024-BCE-PP-268", "Año": 2024, "Localidad": "Balcarce", "Cultivo": "Papa", "Responsable": "Rocio Dominguez", "Tipo": "Demoplot", "Provincia": "Buenos Aires", "Estado": "Planificado", "Fecha_Siembra": "2024-10-10", "Cod_localidad": "BCE", "Cod_cultivo": "PP", "Cod_numero": 268, synced: true }
];

const initialTratamientos: TratamientoResultado[] = [
    { "ID_Tratamiento": "T1", "ID_Ensayo_FK": "2023-BCE-TR-038", "TipoTratamiento": "Testigo", "Tratamiento": "Control sin aplicación", synced: true, "Variable1": "Rendimiento", "Valor1": 6500 },
    { "ID_Tratamiento": "T2", "ID_Ensayo_FK": "2023-BCE-TR-038", "TipoTratamiento": "Tratado", "Tratamiento": "Fungicida A + Fertilizante B", synced: true, "Variable1": "Rendimiento", "Valor1": 7200 },
    { "ID_Tratamiento": "T3", "ID_Ensayo_FK": "2024-OR-CB-107", "TipoTratamiento": "Testigo", "Tratamiento": "Control sin aplicación", synced: true, "Variable1": "Proteína", "Valor1": 10.5 },
    { "ID_Tratamiento": "T4", "ID_Ensayo_FK": "2024-OR-CB-107", "TipoTratamiento": "Tratado", "Tratamiento": "Producto X 15kg/ha", "Producto1": "Producto X", "Dosis1": 15, synced: false, "Variable1": "Proteína", "Valor1": 11.2 },
];

export const useEnsayos = () => {
    const [ensayos, setEnsayos] = useState<Ensayo[]>([]);
    const [tratamientos, setTratamientos] = useState<TratamientoResultado[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedEnsayos = localStorage.getItem('ensayos');
            const storedTratamientos = localStorage.getItem('tratamientos');

            if (storedEnsayos && storedTratamientos) {
                setEnsayos(JSON.parse(storedEnsayos));
                setTratamientos(JSON.parse(storedTratamientos));
            } else {
                // Initialize with sample data if nothing in localStorage
                setEnsayos(initialEnsayos);
                setTratamientos(initialTratamientos);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            setEnsayos(initialEnsayos);
            setTratamientos(initialTratamientos);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem('ensayos', JSON.stringify(ensayos));
                localStorage.setItem('tratamientos', JSON.stringify(tratamientos));
            } catch (error) {
                console.error("Failed to save data to localStorage", error);
            }
        }
    }, [ensayos, tratamientos, isInitialized]);

    const getEnsayoById = useCallback((id: string) => {
        return ensayos.find(e => e.ID_Ensayo === id);
    }, [ensayos]);
    
    const getTratamientosByEnsayoId = useCallback((ensayoId: string) => {
        return tratamientos.filter(t => t.ID_Ensayo_FK === ensayoId);
    }, [tratamientos]);

    const addEnsayo = useCallback((ensayoData: Omit<Ensayo, 'ID_Ensayo' | 'Cod_localidad' | 'Cod_cultivo' | 'Cod_numero' | 'synced'>) => {
        const localidad = LOCALIDADES.find(l => l.nombre === ensayoData.Localidad);
        const cultivo = CULTIVOS.find(c => c.nombre === ensayoData.Cultivo);

        if (!localidad || !cultivo) {
            throw new Error("Localidad o Cultivo inválido");
        }

        const nextNumero = ensayos.filter(e => e.Año === ensayoData.Año && e.Cod_localidad === localidad.codigo && e.Cod_cultivo === cultivo.codigo).length + 1;
        const formattedNumero = String(nextNumero).padStart(3, '0');

        const newEnsayo: Ensayo = {
            ...ensayoData,
            Cod_localidad: localidad.codigo,
            Cod_cultivo: cultivo.codigo,
            Cod_numero: nextNumero,
            ID_Ensayo: `${ensayoData.Año}-${localidad.codigo}-${cultivo.codigo}-${formattedNumero}`,
            synced: false,
        };

        setEnsayos(prev => [...prev, newEnsayo]);
    }, [ensayos]);
    
    const updateEnsayo = useCallback((ensayoId: string, updatedData: Partial<Omit<Ensayo, 'ID_Ensayo'>>) => {
        setEnsayos(prev => prev.map(e => e.ID_Ensayo === ensayoId ? { ...e, ...updatedData, synced: false } : e));
    }, []);

    const addTratamiento = useCallback((tratamientoData: Omit<TratamientoResultado, 'ID_Tratamiento' | 'synced'>) => {
        const newTratamiento: TratamientoResultado = {
            ...tratamientoData,
            ID_Tratamiento: `T-${Date.now()}`,
            synced: false
        };
        setTratamientos(prev => [...prev, newTratamiento]);
    }, []);

    const updateTratamiento = useCallback((tratamientoId: string, updatedData: Partial<Omit<TratamientoResultado, 'ID_Tratamiento'>>) => {
        setTratamientos(prev => prev.map(t => t.ID_Tratamiento === tratamientoId ? { ...t, ...updatedData, synced: false } : t));
    }, []);

    const simulateSync = useCallback(() => {
        setEnsayos(prev => prev.map(e => ({ ...e, synced: true })));
        setTratamientos(prev => prev.map(t => ({ ...t, synced: true })));
    }, []);

    return {
        ensayos,
        tratamientos,
        getEnsayoById,
        getTratamientosByEnsayoId,
        addEnsayo,
        updateEnsayo,
        addTratamiento,
        updateTratamiento,
        simulateSync
    };
};
