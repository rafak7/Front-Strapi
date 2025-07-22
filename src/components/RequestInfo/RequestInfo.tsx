'use client';

import React, { useState } from 'react';
import { Activity, Clock, AlertCircle, CheckCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { useRequestStore } from '../../stores/requestStore';
import { RequestStatus } from '../../stores/types';

const getStatusIcon = (status: RequestStatus) => {
  switch (status) {
    case 'loading':
      return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case 'loading':
      return 'bg-blue-50 border-blue-200';
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export default function RequestInfo() {
  const { lastRequest, requestHistory, clearHistory } = useRequestStore();
  const [showHistory, setShowHistory] = useState(false);

  if (!lastRequest && requestHistory.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Última Requisição */}
      {lastRequest && (
        <div className={`border rounded-lg p-4 ${getStatusColor(lastRequest.status)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(lastRequest.status)}
              <span className="font-medium text-sm">
                {lastRequest.method} {lastRequest.endpoint}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{formatTimestamp(lastRequest.timestamp)}</span>
            </div>
          </div>
          
          {lastRequest.error && (
            <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
              <strong>Erro:</strong> {lastRequest.error}
            </div>
          )}
          
          {lastRequest.status === 'success' && lastRequest.data && (
            <div className="mt-2 text-xs text-gray-600">
              {Array.isArray(lastRequest.data) 
                ? `${lastRequest.data.length} registros retornados`
                : 'Operação realizada com sucesso'
              }
            </div>
          )}
        </div>
      )}

      {/* Histórico de Requisições */}
      {requestHistory.length > 0 && (
        <div className="border rounded-lg">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-sm flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Histórico de Requisições ({requestHistory.length})</span>
            </span>
            {showHistory ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {showHistory && (
            <div className="border-t max-h-64 overflow-y-auto">
              <div className="p-2 space-y-1">
                {requestHistory.slice(0, 10).map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 text-xs rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className="font-mono">
                        {request.method}
                      </span>
                      <span className="text-gray-600">
                        {request.endpoint}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {formatTimestamp(request.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
              
              {requestHistory.length > 10 && (
                <div className="p-2 text-xs text-gray-500 text-center border-t">
                  Mostrando apenas os últimos 10 de {requestHistory.length} registros
                </div>
              )}
              
              <div className="p-2 border-t">
                <button
                  onClick={clearHistory}
                  className="w-full text-xs text-red-600 hover:text-red-700 transition-colors"
                >
                  Limpar Histórico
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 