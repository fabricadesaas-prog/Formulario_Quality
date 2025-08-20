import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PropertyData, RequesterRole, PropertyType, Objective, Occupancy } from '../types';

const initialFormData: PropertyData = {
  client_name: '',
  whatsapp: '',
  requester_role: RequesterRole.PROPRIETARIO,
  address: {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
  },
  property_type: PropertyType.URBANO,
  land_area_m2: null,
  built_area_m2: null,
  construction_age_years: null,
  condition_description: '',
  documents: [],
  document_status: '',
  objective: Objective.VENDA,
  photos: [],
  document_files: [],
  occupancy: Occupancy.DESOCUPADO,
  condominium: '',
  additional_details: '',
};

interface PropertyFormContextType {
  formData: PropertyData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyData>>;
  updateField: (field: keyof PropertyData | `address.${keyof PropertyData['address']}`, value: any) => void;
  updateAddressField: (field: keyof PropertyData['address'], value: string) => void;
  resetForm: () => void;
}

const PropertyFormContext = createContext<PropertyFormContextType | undefined>(undefined);

export const PropertyFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<PropertyData>(initialFormData);

  const updateField = (field: keyof PropertyData | `address.${keyof PropertyData['address']}`, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1] as keyof PropertyData['address'];
      updateAddressField(addressField, value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateAddressField = (field: keyof PropertyData['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <PropertyFormContext.Provider value={{ formData, setFormData, updateField, updateAddressField, resetForm }}>
      {children}
    </PropertyFormContext.Provider>
  );
};

export const usePropertyForm = (): PropertyFormContextType => {
  const context = useContext(PropertyFormContext);
  if (!context) {
    throw new Error('usePropertyForm must be used within a PropertyFormProvider');
  }
  return context;
};