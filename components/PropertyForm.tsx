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
import { REQUESTER_ROLE_OPTIONS, PROPERTY_TYPE_OPTIONS, OBJECTIVE_OPTIONS, OCCUPANCY_OPTIONS, DOCUMENT_OPTIONS, BRAZILIAN_STATES, DOCUMENT_STATUS_OPTIONS } from '../constants';

const PropertyForm: React.FC = () => {
  const { formData, updateField, updateAddressField, resetForm } = usePropertyForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    updateField('whatsapp', value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    updateAddressField('zip', value);
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');

    if (cep.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao buscar o CEP. Verifique a conexão.');
      }
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado. Por favor, verifique o número digitado.');
        return;
      }

      updateAddressField('street', data.logradouro);
      updateAddressField('neighborhood', data.bairro);
      updateAddressField('city', data.localidade);
      updateAddressField('state', data.uf);

      document.getElementById('number')?.focus();
    } catch (error) {
      console.error('CEP lookup error:', error);
      alert(error instanceof Error ? error.message : 'Ocorreu um erro ao buscar o CEP.');
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.documents.length === 0) {
      alert('O campo "Documentos Apresentados" é obrigatório. Por favor, selecione ao menos uma opção.');
      document.getElementById('matricula')?.focus();
      return;
    }

    if (formData.photos.length === 0) {
        alert('O campo "Fotos do Imóvel" é obrigatório. Por favor, adicione ao menos uma foto.');
        document.getElementById('photo-dropzone')?.focus();
        return;
    }

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

  const isCondoNA = formData.condominium === 'N/A';

  const handleCondominiumCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('condominium', e.target.checked ? 'N/A' : '');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#162135] border border-slate-700 p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
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
            required
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
          <div className="md:col-span-2">
            <InputField
              id="zip"
              label="CEP"
              value={formData.address.zip}
              onChange={handleCepChange}
              onBlur={handleCepBlur}
              maxLength={9}
              placeholder="00000-000"
              isLoading={isCepLoading}
              required
            />
          </div>
          <div className="md:col-span-2">
            <InputField id="street" label="Logradouro" value={formData.address.street} onChange={(e) => updateAddressField('street', e.target.value)} required />
          </div>
          <InputField id="number" label="Número" value={formData.address.number} onChange={(e) => updateAddressField('number', e.target.value)} required />
          <InputField id="neighborhood" label="Bairro" value={formData.address.neighborhood} onChange={(e) => updateAddressField('neighborhood', e.target.value)} required />
          <InputField id="city" label="Cidade" value={formData.address.city} onChange={(e) => updateAddressField('city', e.target.value)} required />
          <SelectField id="state" label="UF" value={formData.address.state} onChange={(e) => updateAddressField('state', e.target.value)} options={BRAZILIAN_STATES} required />
        </div>
      </FormSection>

      <FormSection title="Características do Imóvel" icon="fa-home">
        <SelectField id="property_type" label="Tipo de Imóvel" value={formData.property_type} onChange={(e) => updateField('property_type', e.target.value)} options={PROPERTY_TYPE_OPTIONS} required/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField id="land_area_m2" label="Área do Terreno (m²)" type="number" value={formData.land_area_m2?.toString() || ''} onChange={(e) => updateField('land_area_m2', e.target.value ? parseFloat(e.target.value) : null)} required/>
          <InputField id="built_area_m2" label="Área Construída (m²)" type="number" value={formData.built_area_m2?.toString() || ''} onChange={(e) => updateField('built_area_m2', e.target.value ? parseFloat(e.target.value) : null)} required/>
          <InputField id="construction_age_years" label="Idade da Construção (anos)" type="number" value={formData.construction_age_years?.toString() || ''} onChange={(e) => updateField('construction_age_years', e.target.value ? parseFloat(e.target.value) : null)} required/>
        </div>
        <TextareaField id="condition_description" label="Descrição do Estado de Conservação" value={formData.condition_description} onChange={(e) => updateField('condition_description', e.target.value)} required />
      </FormSection>

       <FormSection title="Documentação e Objetivo" icon="fa-file-alt">
        <CheckboxGroup
          label="Documentos Apresentados"
          options={DOCUMENT_OPTIONS}
          selectedValues={formData.documents}
          onChange={(newSelection) => updateField('documents', newSelection)}
          required
        />
        <SelectField
          id="document_status"
          label="Situação da Documentação"
          value={formData.document_status}
          onChange={(e) => updateField('document_status', e.target.value)}
          options={DOCUMENT_STATUS_OPTIONS}
          required
        />
        <SelectField id="objective" label="Objetivo da Avaliação" value={formData.objective} onChange={(e) => updateField('objective', e.target.value)} options={OBJECTIVE_OPTIONS} required/>
      </FormSection>

      <FormSection title="Detalhes Adicionais" icon="fa-info-circle">
        <RadioGroup
          label="Ocupação"
          name="occupancy"
          options={OCCUPANCY_OPTIONS}
          selectedValue={formData.occupancy}
          onChange={(value) => updateField('occupancy', value)}
        />
        <div>
          <InputField
            id="condominium"
            label="Nome do Condomínio"
            value={isCondoNA ? '' : formData.condominium}
            onChange={(e) => updateField('condominium', e.target.value)}
            required={!isCondoNA}
            disabled={isCondoNA}
            placeholder={isCondoNA ? 'Não aplicável' : 'Digite o nome...'}
          />
          <div className="flex items-center mt-2">
            <input
              id="condominium-na"
              type="checkbox"
              checked={isCondoNA}
              onChange={handleCondominiumCheckboxChange}
              className="h-4 w-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
            />
            <label htmlFor="condominium-na" className="ml-2 block text-sm text-gray-300">
              Não se aplica / Imóvel não está em condomínio
            </label>
          </div>
        </div>
        <TextareaField id="additional_details" label="Outros Detalhes Relevantes" value={formData.additional_details} onChange={(e) => updateField('additional_details', e.target.value)} required/>
      </FormSection>

      <FormSection title="Fotos do Imóvel" icon="fa-camera">
        <PhotoURLManager required />
      </FormSection>

      <div className="pt-6 border-t border-slate-700">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-300 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} mr-2`}></i>
          {isSubmitting ? 'Enviando...' : 'Enviar Dados'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;