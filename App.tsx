import React from 'react';
import { PropertyFormProvider } from './contexts/PropertyFormContext';
import PropertyForm from './components/PropertyForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-800">Quality Home Avalia</h1>
          <p className="text-lg text-gray-600 mt-2">Formulário de Coleta de Dados do Imóvel</p>
        </header>

        <main>
          <PropertyFormProvider>
            <PropertyForm />
          </PropertyFormProvider>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Quality Home Avalia. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
