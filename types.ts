
export enum RequesterRole {
  PROPRIETARIO = 'proprietario',
  CORRETOR_CNAI = 'corretor_cnai',
  CORRETOR_SEM_CNAI = 'corretor_sem_cnai',
  ADVOGADO = 'advogado',
}

export enum PropertyType {
  URBANO = 'urbano',
  RURAL = 'rural',
  COMERCIAL = 'comercial',
  TERRENO = 'terreno',
  MISTO = 'misto',
}

export enum Objective {
  VENDA = 'venda',
  PARTILHA = 'partilha',
  JUDICIAL = 'judicial',
  OUTRO = 'outro',
}

export enum Occupancy {
  OCUPADO = 'ocupado',
  DESOCUPADO = 'desocupado',
}

export interface PropertyData {
  client_name: string;
  whatsapp: string;
  requester_role: RequesterRole;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  property_type: PropertyType;
  land_area_m2: number | null;
  built_area_m2: number | null;
  construction_age_years: number | null;
  condition_description: string;
  documents: string[];
  document_status: string;
  objective: Objective;
  photos: string[];
  occupancy: Occupancy;
  condominium: string;
  additional_details: string;
}