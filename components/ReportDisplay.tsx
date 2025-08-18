
import React from 'react';

interface ReportDisplayProps {
  report: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-1/4 mt-6"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
         <div className="h-6 bg-gray-300 rounded w-1/2 mt-6"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
    </div>
);


const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isLoading, error }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(report);
  };
    
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          <p className="font-semibold">Erro!</p>
          <p>{error}</p>
        </div>
      );
    }

    if (!report) {
      return (
        <div className="text-center text-gray-500">
          <i className="fas fa-file-alt text-5xl mb-4 text-gray-300"></i>
          <p className="font-semibold">Seu parecer técnico aparecerá aqui.</p>
          <p>Preencha o formulário e clique em "Gerar Parecer Técnico".</p>
        </div>
      );
    }

    return (
        <div className="prose prose-sm sm:prose-base max-w-none">
            {report.split('###').map((section, index) => {
                if (index === 0 && section.trim() === '') return null;
                if (index === 0) return <p key={index}>{section.trim()}</p>;
                const title = section.substring(0, section.indexOf('\n')).trim();
                const content = section.substring(section.indexOf('\n') + 1);

                return (
                    <div key={index}>
                        <h3>{title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                )
            })}
        </div>
    );
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg h-full">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
            <i className="fas fa-clipboard-check text-blue-600 mr-3"></i>
            Parecer Técnico
        </h2>
        {report && !isLoading && !error && (
            <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors flex items-center"
            >
                <i className="fas fa-copy mr-2"></i>
                Copiar
            </button>
        )}
      </div>
      <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReportDisplay;
