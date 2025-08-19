import React, { useState, useCallback } from 'react';
import { usePropertyForm } from '../contexts/PropertyFormContext';

interface PhotoURLManagerProps {
  required?: boolean;
}

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const PhotoURLManager: React.FC<PhotoURLManagerProps> = ({ required = false }) => {
  const { formData, updateField } = usePropertyForm();
  const photos = formData.photos;
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const fileList = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (fileList.length === 0) return;

    try {
      const dataURLs = await Promise.all(fileList.map(fileToDataURL));
      updateField('photos', [...photos, ...dataURLs]);
    } catch (error) {
      console.error("Error converting files to Data URL:", error);
      alert("Ocorreu um erro ao processar as imagens.");
    }
  }, [photos, updateField]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = ''; // Reset input to allow re-uploading the same file
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    updateField('photos', newPhotos);
  };

  return (
    <div className="space-y-4">
      <label htmlFor="photo-uploader" className="block text-sm font-medium text-gray-300">
        Fotos do Imóvel
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        id="photo-dropzone"
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('photo-input')?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#162135] focus:ring-cyan-500
          ${isDragging ? 'border-cyan-400 bg-[#1a2942]' : 'border-slate-600 hover:border-slate-500 bg-[#0D182A]'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center pointer-events-none">
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF ou WEBP</p>
        </div>
        <input
          id="photo-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={photo} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label={`Remover foto ${index + 1}`}
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoURLManager;
