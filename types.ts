
export interface Localidad {
  nombre: string;
  codigo: string;
}

export interface Cultivo {
  nombre: string;
  codigo: string;
}

export interface Ensayo {
  ID_Ensayo: string;
  Año: number;
  Localidad: string;
  Cultivo: string;
  Proyecto?: string;
  Responsable: string;
  Tipo: 'Ensayo' | 'Demoplot';
  Provincia: string;
  Estado: 'Planificado' | 'En Curso' | 'Cosechado' | 'Completado' | 'Cancelado';
  Fecha_Siembra?: string;
  Fecha_Cosecha?: string;
  Contacto?: string;
  Cod_localidad: string;
  Cod_cultivo: string;
  Cod_numero: number;
  latitud?: number;
  longitud?: number;
  imagenes?: string[];
  synced: boolean;
}

export interface TratamientoResultado {
  ID_Tratamiento: string;
  ID_Ensayo_FK: string;
  TipoTratamiento: 'Testigo' | 'Tratado';
  Tratamiento: string;
  Producto1?: string;
  Dosis1?: number;
  Producto2?: string;
  Dosis2?: number;
  Producto3?: string;
  Dosis3?: number;
  Variable1?: string;
  Valor1?: number;
  Variable2?: string;
  Valor2?: number;
  Variable3?: string;
  Valor3?: number;
  Variable4?: string;
  Valor4?: number;
  Variable5?: string;
  Valor5?: number;
  Variable6?: string;
  Valor6?: number;
  Variable7?: string;
  Valor7?: number;
  Variable8?: string;
  Valor8?: number;
  Variable9?: string;
  Valor9?: number;
  Variable10?: string;
  Valor10?: number;
  synced: boolean;
}