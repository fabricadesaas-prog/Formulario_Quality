import React from 'react';
import { usePropertyForm } from '../contexts/PropertyFormContext';

const PhotoURLManager: React.FC = () => {
  const { formData, updateField } = usePropertyForm();
  const photos = formData.photos;

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    updateField('photos', newPhotos);
  };

  const addPhotoField = () => {
    updateField('photos', [...photos, '']);
  };

  const removePhotoField = (index: number) => {
    if (photos.length <= 1) return;
    const newPhotos = photos.filter((_, i) => i !== index);
    updateField('photos', newPhotos);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Links das Fotos
      </label>
      {photos.map((photo, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="url"
            value={photo}
            onChange={(e) => handlePhotoChange(index, e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white text-gray-900 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => removePhotoField(index)}
            disabled={photos.length <= 1}
            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPhotoField}
        className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
      >
        <i className="fas fa-plus mr-2"></i>
        Adicionar outra foto
      </button>
    </div>
  );
};

export default PhotoURLManager;