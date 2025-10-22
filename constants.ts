
import { Localidad, Cultivo, Ensayo, TratamientoResultado } from './types';

export const LOCALIDADES: Localidad[] = [
    { nombre: '9 de Julio', codigo: '9J' }, { nombre: 'Amenabar', codigo: 'AMB' },
    { nombre: 'Balcarce', codigo: 'BCE' }, { nombre: 'Baradero', codigo: 'BA' },
    { nombre: 'Bigand', codigo: 'BIG' }, { nombre: 'Bunge', codigo: 'BU' },
    { nombre: 'Catrilo', codigo: 'CA' }, { nombre: 'Chacabuco', codigo: 'CH' },
    { nombre: 'Chillar', codigo: 'CH' }, { nombre: 'Chivilcoy', codigo: 'CH' },
    { nombre: 'Christophersen', codigo: 'CT' }, { nombre: 'Colonia Tirolesa', codigo: 'CT' },
    { nombre: 'Córdoba', codigo: 'CBA' }, { nombre: 'Diego de alvear', codigo: 'DA' },
    { nombre: 'Heavy', codigo: 'HE' }, { nombre: 'Iraola', codigo: 'TA' },
    { nombre: 'Isla Verde', codigo: 'IV' }, { nombre: 'Laguna larga', codigo: 'LL' },
    { nombre: 'Las Rosas', codigo: 'LR' }, { nombre: 'Lonquimay', codigo: 'LQ' },
    { nombre: 'Los Toldos', codigo: 'LT' }, { nombre: 'Madariaga', codigo: 'MD' },
    { nombre: 'Marcos Juarez', codigo: 'MJ' }, { nombre: 'Miramar', codigo: 'MR' },
    { nombre: 'Montes de Oca', codigo: 'MO' }, { nombre: 'Nogoya', codigo: 'ER' },
    { nombre: 'Orense', codigo: 'OR' }, { nombre: 'Ortiz Basualdo', codigo: 'OB' },
    { nombre: 'Otamendi', codigo: 'OT' }, { nombre: 'Pergamino', codigo: 'PG' },
    { nombre: 'Piedritas', codigo: 'PD' }, { nombre: 'Pieres', codigo: 'PR' },
    { nombre: 'Rancagua', codigo: 'RC' }, { nombre: 'Rio Cuarto', codigo: 'RC' },
    { nombre: 'Rojas', codigo: 'RO' }, { nombre: 'Rosario', codigo: 'RS' },
    { nombre: 'Saladillo', codigo: 'SL' }, { nombre: 'Salto', codigo: 'SA' },
    { nombre: 'San Agustín', codigo: 'BCE' }, { nombre: 'San Jerónimo', codigo: 'SJ' },
    { nombre: 'San Juan', codigo: 'SJN' }, { nombre: 'San Justo', codigo: 'SJU' },
    { nombre: 'Tandil', codigo: 'TA' }, { nombre: 'Tres Arroyos', codigo: 'TA' },
    { nombre: 'Tucuman', codigo: 'TU' }, { nombre: 'Victoria', codigo: 'VC' },
    { nombre: 'Mar del Plata', codigo: 'MDP' }, { nombre: 'Loberia', codigo: 'LB' },
    { nombre: 'Necochea', codigo: 'NC' }, { nombre: 'Mendoza', codigo: 'MDZ' }
];

export const CULTIVOS: Cultivo[] = [
    { nombre: 'Arveja', codigo: 'AV' }, { nombre: 'Cebada', codigo: 'CB' },
    { nombre: 'Girasol', codigo: 'GS' }, { nombre: 'Maní', codigo: 'MN' },
    { nombre: 'Maiz', codigo: 'MZ' }, { nombre: 'Papa', codigo: 'PP' },
    { nombre: 'Soja', codigo: 'SJ' }, { nombre: 'Trigo', codigo: 'TR' },
    { nombre: 'Tomate', codigo: 'TT' }, { nombre: 'Garbanzo', codigo: 'GB' },
    { nombre: 'Pastura', codigo: 'PT' }, { nombre: 'S/C', codigo: 'S/C' },
    { nombre: 'Ajo', codigo: 'AJ' }, { nombre: 'Sorgo', codigo: 'SG' },
    { nombre: 'Zanahoria', codigo: 'ZH' }
];

export const RESPONSABLES: string[] = [
    'Rocio Dominguez', 'Manuel Aguirre Saravia', 'Ensayo', 'Demoplot', 'Honorio', 'Agidea',
    'Pablo Gobet', 'Gonzalez Montaner', 'Agrar del Sur', 'Agroconsultor'
];

export const ESTADOS: Ensayo['Estado'][] = [
    'Planificado', 'En Curso', 'Cosechado', 'Completado', 'Cancelado'
];

export const TIPOS_ENSAYO: Ensayo['Tipo'][] = [
    'Ensayo', 'Demoplot'
];

export const TIPOS_TRATAMIENTO: TratamientoResultado['TipoTratamiento'][] = [
    'Testigo', 'Tratado'
];

export const PROVINCIAS: string[] = [
    'Buenos Aires', 'Santa Fé', 'Entre Ríos', 'Córdoba', 'La Pampa', 'San Juan', 'Tucuman', 'Mendoza'
];