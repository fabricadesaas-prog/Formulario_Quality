import { createClient } from '@supabase/supabase-js';
import { PropertyData } from '../types';

const supabaseUrl = 'https://mouhzmxwelqpofntplxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdWh6bXh3ZWxxcG9mbnRwbHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjMwMjIsImV4cCI6MjA3MDIzOTAyMn0.NWkngzdH3c7RGdvc89kNBfwwz8uJ9PP2zvs4zblZjXI';

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key not provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const saveEvaluationData = async (data: PropertyData) => {
  const { address, ...restOfData } = data;
  
  // Mapeia os dados do formulário para a estrutura da tabela
  const submissionData = {
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