'use client';

import React, { useState } from 'react';
import { FaServer, FaTerminal, FaChevronDown, FaChevronUp, FaWindows, FaFileCode } from 'react-icons/fa';

interface ServerConnectionGuideProps {
  className?: string;
}

export default function ServerConnectionGuide({ className = '' }: ServerConnectionGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg overflow-hidden ${className}`}>
      <div 
        className="px-4 py-3 flex items-center cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaServer className="text-blue-600 mr-2" />
        <div className="flex-grow">
          <h3 className="font-medium text-blue-800">Problemas de conexão com o servidor</h3>
          <p className="text-sm text-blue-600">Clique para ver instruções sobre como iniciar o servidor</p>
        </div>
        {isExpanded ? (
          <FaChevronUp className="text-blue-500" />
        ) : (
          <FaChevronDown className="text-blue-500" />
        )}
      </div>
      
      {isExpanded && (
        <div className="px-4 py-3 border-t border-blue-200 bg-white">
          <p className="mb-3 text-zinc-700">
            O servidor backend parece estar offline. Siga estas instruções para iniciá-lo:
          </p>
          
          <div className="bg-zinc-900 text-white p-4 rounded-lg mb-4 font-mono text-sm">
            <div className="flex items-center mb-2">
              <FaFileCode className="mr-2" />
              <span className="text-zinc-400">Opção mais fácil: Use o script de inicialização</span>
            </div>
            <ol className="space-y-2 text-zinc-300">
              <li>Execute o arquivo <span className="bg-zinc-800 px-2 py-0.5 rounded">start-backend.bat</span> na raiz do projeto.</li>
            </ol>
          </div>
          
          <div className="bg-zinc-900 text-white p-4 rounded-lg mb-4 font-mono text-sm">
            <div className="flex items-center mb-2">
              <FaWindows className="mr-2" />
              <span className="text-zinc-400">Windows PowerShell: Iniciar o servidor backend</span>
            </div>
            <ol className="space-y-2 text-zinc-300">
              <li><span className="text-amber-400">PS></span> cd ..\backend</li>
              <li><span className="text-amber-400">PS></span> npm run dev</li>
            </ol>
          </div>
          
          <div className="bg-zinc-900 text-white p-4 rounded-lg mb-4 font-mono text-sm">
            <div className="flex items-center mb-2">
              <FaTerminal className="mr-2" />
              <span className="text-zinc-400">Terminal Linux/Mac: Iniciar o servidor backend</span>
            </div>
            <ol className="space-y-2 text-zinc-300">
              <li><span className="text-amber-400">$</span> cd ../backend</li>
              <li><span className="text-amber-400">$</span> npm run dev</li>
            </ol>
          </div>
          
          <p className="text-sm text-zinc-600 mb-3">
            Se você estiver usando Docker, pode iniciar todos os serviços com:
          </p>
          
          <div className="bg-zinc-900 text-white p-4 rounded-lg font-mono text-sm">
            <div className="flex items-center mb-2">
              <FaTerminal className="mr-2" />
              <span className="text-zinc-400">Terminal: Iniciar com Docker</span>
            </div>
            <ol className="space-y-2 text-zinc-300">
              <li><span className="text-amber-400">$</span> docker compose up -d</li>
            </ol>
          </div>
          
          <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
            <p className="text-sm">
              <strong>Nota:</strong> Certifique-se de que o servidor backend esteja configurado corretamente e que todas as dependências estejam instaladas. Se for a primeira vez executando o servidor, você pode precisar executar <code className="bg-yellow-100 px-1 py-0.5 rounded">npm install</code> primeiro.
            </p>
          </div>
          
          <p className="mt-4 text-sm text-zinc-700">
            Após iniciar o servidor, clique no botão "Tentar novamente" para verificar a conexão.
          </p>
        </div>
      )}
    </div>
  );
} 