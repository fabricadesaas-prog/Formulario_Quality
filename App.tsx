
import React from 'react';
import { PropertyFormProvider } from './contexts/PropertyFormContext';
import PropertyForm from './components/PropertyForm';

const Logo: React.FC = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="flex items-center gap-4">
      {/* Log */}
      <img 
        alt="Quality Home Avalia Logo" 
        className="mx-auto h-24" 
        src="https://raw.githubusercontent.com/riquelima/avaliao-imvel-quality-home/refs/heads/main/logoTransparente2.png" 
      />
    </div>
   <p className="mt-4 text-slate-600 text-lg">Formulário de Solicitação de Avaliação de Imóvel</p>
  </div>
);


const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8">
          <Logo />
        </header>

        <main className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
          <PropertyFormProvider>
            <PropertyForm />
          </PropertyFormProvider>
        </main>
      </div>
    </div>
  );
};

export default App;
