import React, { useState, useCallback } from 'react';
import { usePropertyForm } from '../contexts/PropertyFormContext';
import type { PropertyData } from '../types';

interface PhotoURLManagerProps {
  required?: boolean;
  formField: 'photos' | 'document_files';
  label: string;
}

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const PhotoURLManager: React.FC<PhotoURLManagerProps> = ({ required = false, formField, label }) => {
  const { formData, updateField } = usePropertyForm();
  const files = (formData[formField as keyof PropertyData] as string[]) || [];
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    const fileList = Array.from(incomingFiles);
    if (fileList.length === 0) return;

    try {
      const dataURLs = await Promise.all(fileList.map(fileToDataURL));
      updateField(formField, [...files, ...dataURLs]);
    } catch (error) {
      console.error("Error converting files to Data URL:", error);
      alert("Ocorreu um erro ao processar as imagens.");
    }
  }, [files, updateField, formField]);

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

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    updateField(formField, newFiles);
  };

  const inputId = `file-input-${formField}`;

  return (
    <section>
        <label htmlFor={inputId} className="block text-sm font-medium text-blue-900/90 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div
            id={`photo-dropzone-${formField}`}
            tabIndex={0}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById(inputId)?.click()}
            className={`relative flex flex-col items-center justify-center w-full h-32 mt-1 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
            ${isDragging ? 'border-blue-400 bg-blue-100' : 'border-slate-300 bg-blue-50 hover:border-orange-500'}
            `}
        >
            <div className="flex flex-col items-center justify-center text-center pointer-events-none text-slate-500">
            <i className="fas fa-cloud-upload-alt text-3xl mb-2 text-slate-400"></i>
            <p className="text-sm">
                Arraste e solte os arquivos aqui, ou <span className="font-semibold text-orange-500 underline">clique para selecionar</span>
            </p>
            </div>
            <input
            id={inputId}
            type="file"
            multiple
            accept={formField === 'photos' ? 'image/*' : '*/*'}
            onChange={handleFileSelect}
            className="hidden"
            />
        </div>

        {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4">
            {files.map((file, index) => (
                <div key={index} className="relative group aspect-square">
                {file.startsWith('data:image') ? (
                    <img src={file} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md border" />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md border flex items-center justify-center p-2">
                        <i className="fas fa-file-alt text-3xl text-gray-400"></i>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 shadow"
                    aria-label={`Remover arquivo ${index + 1}`}
                >
                    <i className="fas fa-times text-xs"></i>
                </button>
                </div>
            ))}
            </div>
        )}
    </section>
  );
};

export default PhotoURLManager;