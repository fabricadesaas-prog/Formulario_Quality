import React, { useState } from 'react';
import { usePropertyForm } from '../contexts/PropertyFormContext';
import { saveEvaluationData } from '../services/supabaseClient';
import FormSection from './FormSection';
import InputField from './InputField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import PhotoURLManager from './PhotoURLManager';
import { REQUESTER_ROLE_OPTIONS, PROPERTY_TYPE_OPTIONS, OBJECTIVE_OPTIONS, OCCUPANCY_OPTIONS, DOCUMENT_OPTIONS, BRAZILIAN_STATES } from '../constants';

const PropertyForm: React.FC = () => {
  const { formData, updateField, updateAddressField, resetForm } = usePropertyForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    updateField('whatsapp', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const webhookUrl = 'https://n8n.felipeteti.com/webhook/formulario';

    try {
      // Create promises for both Supabase and the webhook
      const supabasePromise = saveEvaluationData(formData);
      
      const webhookPromise = fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then(response => {
        if (!response.ok) {
          // If the server response is not ok, throw an error
          throw new Error(`Falha ao enviar para o webhook: Status ${response.status}`);
        }
        return response.json(); 
      });

      // Wait for both promises to complete successfully
      await Promise.all([supabasePromise, webhookPromise]);

      alert('Dados enviados com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Submission Error:', error);
      alert(`Ocorreu um erro ao enviar os dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
      <FormSection title="Informações do Cliente e Solicitante" icon="fa-user">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="client_name" label="Nome do Cliente" value={formData.client_name} onChange={(e) => updateField('client_name', e.target.value)} required />
          <InputField
            id="whatsapp"
            label="WhatsApp"
            value={formData.whatsapp}
            onChange={handleWhatsappChange}
            placeholder="(XX) XXXXX-XXXX"
            type="tel"
            maxLength={15}
          />
        </div>
        <RadioGroup
          label="Qualificação do Solicitante"
          name="requester_role"
          options={REQUESTER_ROLE_OPTIONS}
          selectedValue={formData.requester_role}
          onChange={(value) => updateField('requester_role', value)}
        />
      </FormSection>

      <FormSection title="Endereço do Imóvel" icon="fa-map-marker-alt">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="street" label="Logradouro" value={formData.address.street} onChange={(e) => updateAddressField('street', e.target.value)} required />
          <InputField id="number" label="Número" value={formData.address.number} onChange={(e) => updateAddressField('number', e.target.value)} required />
          <InputField id="neighborhood" label="Bairro" value={formData.address.neighborhood} onChange={(e) => updateAddressField('neighborhood', e.target.value)} required />
          <InputField id="city" label="Cidade" value={formData.address.city} onChange={(e) => updateAddressField('city', e.target.value)} required />
          <SelectField id="state" label="UF" value={formData.address.state} onChange={(e) => updateAddressField('state', e.target.value)} options={BRAZILIAN_STATES} required />
          <InputField id="zip" label="CEP" value={formData.address.zip} onChange={(e) => updateAddressField('zip', e.target.value)} required />
        </div>
      </FormSection>

      <FormSection title="Características do Imóvel" icon="fa-home">
        <SelectField id="property_type" label="Tipo de Imóvel" value={formData.property_type} onChange={(e) => updateField('property_type', e.target.value)} options={PROPERTY_TYPE_OPTIONS} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField id="land_area_m2" label="Área do Terreno (m²)" type="number" value={formData.land_area_m2?.toString() || ''} onChange={(e) => updateField('land_area_m2', e.target.value ? parseFloat(e.target.value) : null)} />
          <InputField id="built_area_m2" label="Área Construída (m²)" type="number" value={formData.built_area_m2?.toString() || ''} onChange={(e) => updateField('built_area_m2', e.target.value ? parseFloat(e.target.value) : null)} />
          <InputField id="construction_age_years" label="Idade da Construção (anos)" type="number" value={formData.construction_age_years?.toString() || ''} onChange={(e) => updateField('construction_age_years', e.target.value ? parseFloat(e.target.value) : null)} />
        </div>
        <TextareaField id="condition_description" label="Descrição do Estado de Conservação" value={formData.condition_description} onChange={(e) => updateField('condition_description', e.target.value)} required />
      </FormSection>

       <FormSection title="Documentação e Objetivo" icon="fa-file-alt">
        <CheckboxGroup
          label="Documentos Apresentados"
          options={DOCUMENT_OPTIONS}
          selectedValues={formData.documents}
          onChange={(newSelection) => updateField('documents', newSelection)}
        />
        <InputField id="document_status" label="Situação da Documentação" value={formData.document_status} onChange={(e) => updateField('document_status', e.target.value)} placeholder="Ex: Regularizada, pendente de averbação, etc." required />
        <SelectField id="objective" label="Objetivo da Avaliação" value={formData.objective} onChange={(e) => updateField('objective', e.target.value)} options={OBJECTIVE_OPTIONS} />
      </FormSection>

      <FormSection title="Detalhes Adicionais" icon="fa-info-circle">
        <RadioGroup
          label="Ocupação"
          name="occupancy"
          options={OCCUPANCY_OPTIONS}
          selectedValue={formData.occupancy}
          onChange={(value) => updateField('occupancy', value)}
        />
        <InputField id="condominium" label='Condomínio (Nome ou "N/A")' value={formData.condominium} onChange={(e) => updateField('condominium', e.target.value)} required />
        <TextareaField id="additional_details" label="Outros Detalhes Relevantes" value={formData.additional_details} onChange={(e) => updateField('additional_details', e.target.value)} />
      </FormSection>

      <FormSection title="Fotos do Imóvel" icon="fa-camera">
        <PhotoURLManager />
      </FormSection>

      <div className="pt-6 border-t border-gray-200">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} mr-2`}></i>
          {isSubmitting ? 'Enviando...' : 'Enviar Dados'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;