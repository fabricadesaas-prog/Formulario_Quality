import { createClient } from '@supabase/supabase-js';
import { PropertyData, Objective, Occupancy, PropertyType, RequesterRole } from '../types';

const supabaseUrl = 'https://mouhzmxwelqpofntplxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdWh6bXh3ZWxxcG9mbnRwbHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjMwMjIsImV4cCI6MjA3MDIzOTAyMn0.NWkngzdH3c7RGdvc89kNBfwwz8uJ9PP2zvs4zblZjXI';

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key not provided.");
}

// Define the shape of data for inserting into the property_evaluations table
type PropertyEvaluationInsert = {
  client_name: string;
  whatsapp: string;
  requester_role: RequesterRole;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
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
};

// Define the database schema for Supabase client
export type Database = {
  public: {
    Tables: {
      property_evaluations: {
        Row: PropertyEvaluationInsert;
        Insert: PropertyEvaluationInsert;
        Update: Partial<PropertyEvaluationInsert>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};


const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const saveEvaluationData = async (data: PropertyData) => {
  // O campo 'document_files' é removido aqui para evitar o erro, pois a coluna não existe no Supabase.
  const { address, document_files, ...restOfData } = data;
  
  // Mapeia os dados do formulário para a estrutura da tabela
  const submissionData: PropertyEvaluationInsert = {
    ...restOfData,
    address_street: address.street,
    address_number: address.number,
    address_neighborhood: address.neighborhood,
    address_city: address.city,
    address_state: address.state,
    address_zip: address.zip,
    // Garante que URLs de fotos vazias não sejam salvas
    photos: data.photos.filter(url => url && url.trim() !== '')
  };

  const { error } = await supabase
    .from('property_evaluations')
    .insert([submissionData]);

  if (error) {
    console.error('Error inserting data into Supabase:', error);
    throw new Error(`Falha ao salvar no Supabase: ${error.message}`);
  }
};

export default supabase;
