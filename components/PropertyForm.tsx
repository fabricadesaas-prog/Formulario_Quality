import React, { useState } from 'react';
import { usePropertyForm } from '../contexts/PropertyFormContext';
import { saveEvaluationData } from '../services/supabaseClient';
import FormSection from './FormSection';
import InputField from './InputField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import CheckboxGroup from './CheckboxGroup';
import PhotoURLManager from './PhotoURLManager';
import { PROPERTY_TYPE_OPTIONS, OBJECTIVE_OPTIONS, OCCUPANCY_OPTIONS, DOCUMENT_OPTIONS, BRAZILIAN_STATES, DOCUMENT_STATUS_OPTIONS } from '../constants';

const PropertyForm: React.FC = () => {
  const { formData, updateField, updateAddressField, resetForm } = usePropertyForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  
  // State for "Not Applicable" checkboxes
  const [isLandAreaNA, setIsLandAreaNA] = useState(false);
  const [isBuiltAreaNA, setIsBuiltAreaNA] = useState(false);
  const [isConstructionAgeNA, setIsConstructionAgeNA] = useState(false);
  const [isCondoNA, setIsCondoNA] = useState(false);

  const handleNAChange = (setter: React.Dispatch<React.SetStateAction<boolean>>, field: 'land_area_m2' | 'built_area_m2' | 'construction_age_years' | 'condominium', e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setter(isChecked);
    
    if (isChecked) {
      updateField(field, null);
      return;
    }

    // When unchecked, reset to a default "empty" state.
    if (field === 'condominium') {
      updateField(field, '');
    } else {
      // For number fields, reset to null, which the input will show as empty.
      updateField(field, null);
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    updateField('whatsapp', value);
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) return;

    setIsFetchingCep(true);
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        if (!response.ok) throw new Error('Falha ao buscar CEP.');
        
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado. Por favor, verifique o número digitado.');
            updateAddressField('street', '');
            updateAddressField('neighborhood', '');
            updateAddressField('city', '');
            updateAddressField('state', '');
        } else {
            updateAddressField('street', data.logradouro || '');
            updateAddressField('neighborhood', data.bairro || '');
            updateAddressField('city', data.localidade || '');
            updateAddressField('state', data.uf || '');
            document.getElementById('number')?.focus();
        }
    } catch (error) {
        console.error('CEP Fetch Error:', error);
        alert('Não foi possível buscar o endereço para este CEP. Por favor, preencha manualmente.');
    } finally {
        setIsFetchingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.substring(0, 8);
    
    const formattedValue = value.length > 5 ? value.replace(/^(\d{5})(\d)/, '$1-$2') : value;
    updateAddressField('zip', formattedValue);

    if (value.length === 8) {
        fetchAddressByCep(value);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.documents.length === 0) {
      alert('O campo "Documentos Disponíveis" é obrigatório. Por favor, selecione ao menos uma opção.');
      document.getElementById('matricula')?.focus();
      return;
    }

    if (formData.photos.length === 0) {
        alert('O campo "Fotos do Imóvel" é obrigatório. Por favor, adicione ao menos uma foto.');
        document.getElementById('photo-dropzone-photos')?.focus();
        return;
    }

    setIsSubmitting(true);
    
    const webhookUrl = 'https://n8n.felipeteti.com/webhook/formulario';

    try {
      const supabasePromise = saveEvaluationData(formData);
      
      const webhookPromise = fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).then(response => {
        if (!response.ok) throw new Error(`Falha ao enviar para o webhook: Status ${response.status}`);
        return response.json(); 
      });

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Informações do Solicitante" icon="fa-user">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="client_name" label="Nome Completo do Solicitante" value={formData.client_name} onChange={(e) => updateField('client_name', e.target.value)} required />
          <InputField
            id="whatsapp"
            label="Whatsapp"
            value={formData.whatsapp}
            onChange={handleWhatsappChange}
            placeholder="(XX) XXXXX-XXXX"
            type="tel"
            maxLength={15}
            required
          />
        </div>
        <InputField
            id="requester_role"
            label="Tipo de Cliente"
            value="Proprietário"
            disabled
        />
      </FormSection>

      <FormSection title="Endereço do Imóvel" icon="fa-map-marker-alt">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="zip"
              label="CEP"
              value={formData.address.zip}
              onChange={handleCepChange}
              maxLength={9}
              required
              isLoading={isFetchingCep}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <InputField
                id="street"
                label="Logradouro (Rua, Av.)"
                value={formData.address.street}
                onChange={(e) => updateAddressField('street', e.target.value)}
                required
                isLoading={isFetchingCep}
              />
            </div>
            <InputField
              id="number"
              label="Número"
              value={formData.address.number}
              onChange={(e) => updateAddressField('number', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="neighborhood"
              label="Bairro"
              value={formData.address.neighborhood}
              onChange={(e) => updateAddressField('neighborhood', e.target.value)}
              required
              isLoading={isFetchingCep}
            />
            <InputField
              id="city"
              label="Cidade"
              value={formData.address.city}
              onChange={(e) => updateAddressField('city', e.target.value)}
              required
              isLoading={isFetchingCep}
            />
            <SelectField
              id="state"
              label="UF"
              value={formData.address.state}
              onChange={(e) => updateAddressField('state', e.target.value)}
              options={BRAZILIAN_STATES}
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Detalhes do Imóvel" icon="fa-ruler-combined">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField id="property_type" label="Tipo de Imóvel" value={formData.property_type} onChange={(e) => updateField('property_type', e.target.value)} options={PROPERTY_TYPE_OPTIONS} required/>
            <div className="flex flex-col-reverse">
                <InputField 
                    id="construction_age_years" 
                    label="Idade da Construção (anos)" 
                    placeholder="Aproximada" 
                    type="number" 
                    value={formData.construction_age_years?.toString() || ''} 
                    onChange={(e) => updateField('construction_age_years', e.target.value ? parseFloat(e.target.value) : null)} 
                    required={!isConstructionAgeNA}
                    disabled={isConstructionAgeNA}
                />
                <div className="flex items-center mb-2">
                    <input 
                        id="construction_age_na" 
                        type="checkbox" 
                        checked={isConstructionAgeNA} 
                        onChange={(e) => handleNAChange(setIsConstructionAgeNA, 'construction_age_years', e)} 
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
                    />
                    <label htmlFor="construction_age_na" className="ml-2 text-sm font-medium text-blue-900/90">Não se aplica</label>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col-reverse">
                <InputField id="land_area_m2" label="Área do Terreno (m²)" type="number" value={formData.land_area_m2?.toString() || ''} onChange={(e) => updateField('land_area_m2', e.target.value ? parseFloat(e.target.value) : null)} required={!isLandAreaNA} disabled={isLandAreaNA} />
                <div className="flex items-center mb-2"><input id="land_area_na" type="checkbox" checked={isLandAreaNA} onChange={(e) => handleNAChange(setIsLandAreaNA, 'land_area_m2', e)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" /><label htmlFor="land_area_na" className="ml-2 text-sm font-medium text-blue-900/90">Não se aplica</label></div>
            </div>
            <div className="flex flex-col-reverse">
                <InputField id="built_area_m2" label="Área Construída (m²)" type="number" value={formData.built_area_m2?.toString() || ''} onChange={(e) => updateField('built_area_m2', e.target.value ? parseFloat(e.target.value) : null)} required={!isBuiltAreaNA} disabled={isBuiltAreaNA} />
                <div className="flex items-center mb-2"><input id="built_area_na" type="checkbox" checked={isBuiltAreaNA} onChange={(e) => handleNAChange(setIsBuiltAreaNA, 'built_area_m2', e)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" /><label htmlFor="built_area_na" className="ml-2 text-sm font-medium text-blue-900/90">Não se aplica</label></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField id="occupancy" label="Ocupação" value={formData.occupancy} onChange={(e) => updateField('occupancy', e.target.value)} options={OCCUPANCY_OPTIONS} required />
            <div className="flex flex-col-reverse">
                <InputField id="condominium" label="Nome do Condomínio" value={isCondoNA ? '' : formData.condominium ?? ''} onChange={(e) => updateField('condominium', e.target.value)} required={!isCondoNA} disabled={isCondoNA} />
                <div className="flex items-center mb-2"><input id="condo_na" type="checkbox" checked={isCondoNA} onChange={(e) => handleNAChange(setIsCondoNA, 'condominium', e)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" /><label htmlFor="condo_na" className="ml-2 text-sm font-medium text-blue-900/90">Não se aplica</label></div>
            </div>
        </div>
        <TextareaField id="condition_description" label="Estado Geral do Imóvel" value={formData.condition_description} onChange={(e) => updateField('condition_description', e.target.value)} placeholder="Descrição das condições gerais, como pintura, estrutura, acabamentos, etc." required />
      </FormSection>

      <FormSection title="Documentação e Finalidade" icon="fa-file-alt">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CheckboxGroup label="Documentos Disponíveis" options={DOCUMENT_OPTIONS} selectedValues={formData.documents} onChange={(newSelection) => updateField('documents', newSelection)} required />
            <div className="space-y-4">
                <SelectField id="document_status" label="Situação dos Documentos" value={formData.document_status} onChange={(e) => updateField('document_status', e.target.value)} options={DOCUMENT_STATUS_OPTIONS} required />
                <SelectField id="objective" label="Finalidade da Avaliação" value={formData.objective} onChange={(e) => updateField('objective', e.target.value)} options={OBJECTIVE_OPTIONS} required />
            </div>
        </div>
      </FormSection>
      
      <PhotoURLManager formField="photos" label="Fotos do Imóvel" required />
      <PhotoURLManager formField="document_files" label="Anexar Documentos (Opcional)" />
      
      <FormSection title="Detalhes Adicionais" icon="fa-info-circle">
          <TextareaField id="additional_details" label="Detalhes Adicionais" value={formData.additional_details} onChange={(e) => updateField('additional_details', e.target.value)} placeholder="Informe aqui qualquer detalhe relevante sobre o imóvel, vizinhança, etc." />
      </FormSection>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-300 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;