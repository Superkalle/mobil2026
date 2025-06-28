import React, { useState, useEffect } from 'react';
import { Play, Square, AlertCircle, Activity, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Automation {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'warning';
  lastRun: string;
  executions: number;
  webhookUrl: string;
  description: string;
}

interface StatusData {
  totalAutomations: number;
  runningAutomations: number;
  totalExecutions: number;
  successRate: number;
}

function App() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Email Notification',
      status: 'running',
      lastRun: '2 min ago',
      executions: 142,
      webhookUrl: 'https://n8n.example.com/webhook/email-notification',
      description: 'Sendet E-Mail-Benachrichtigungen bei wichtigen Events'
    },
    {
      id: '2',
      name: 'Data Sync',
      status: 'running',
      lastRun: '5 min ago',
      executions: 89,
      webhookUrl: 'https://n8n.example.com/webhook/data-sync',
      description: 'Synchronisiert Daten zwischen verschiedenen Systemen'
    },
    {
      id: '3',
      name: 'Report Generator',
      status: 'stopped',
      lastRun: '1 hour ago',
      executions: 23,
      webhookUrl: 'https://n8n.example.com/webhook/report-generator',
      description: 'Generiert automatische Berichte'
    },
    {
      id: '4',
      name: 'Backup Process',
      status: 'error',
      lastRun: '3 hours ago',
      executions: 67,
      webhookUrl: 'https://n8n.example.com/webhook/backup-process',
      description: 'Erstellt regelmäßige Backups'
    }
  ]);

  const [statusData, setStatusData] = useState<StatusData>({
    totalAutomations: 4,
    runningAutomations: 2,
    totalExecutions: 321,
    successRate: 94.2
  });

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const triggerWebhook = async (automation: Automation) => {
    setIsLoading(automation.id);
    
    try {
      // Simuliere API-Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update automation status
      setAutomations(prev => prev.map(auto => 
        auto.id === automation.id 
          ? { ...auto, executions: auto.executions + 1, lastRun: 'just now' }
          : auto
      ));
      
      // Update status data
      setStatusData(prev => ({
        ...prev,
        totalExecutions: prev.totalExecutions + 1
      }));
      
    } catch (error) {
      console.error('Webhook trigger failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-error-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning-600" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'running':
        return 'status-running';
      case 'stopped':
        return 'status-stopped';
      case 'error':
        return 'status-error';
      case 'warning':
        return 'status-warning';
      default:
        return 'status-stopped';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">N8N Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt</p>
                <p className="text-2xl font-bold text-gray-900">{statusData.totalAutomations}</p>
              </div>
              <Activity className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktiv</p>
                <p className="text-2xl font-bold text-success-600">{statusData.runningAutomations}</p>
              </div>
              <Play className="w-8 h-8 text-success-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausführungen</p>
                <p className="text-2xl font-bold text-gray-900">{statusData.totalExecutions}</p>
              </div>
              <Zap className="w-8 h-8 text-warning-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erfolgsrate</p>
                <p className="text-2xl font-bold text-success-600">{statusData.successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
          </div>
        </div>

        {/* Automations List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Automatisierungen</h2>
          
          {automations.map((automation) => (
            <div key={automation.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(automation.status)}
                    <h3 className="text-lg font-medium text-gray-900">{automation.name}</h3>
                    <span className={getStatusClass(automation.status)}>
                      {automation.status === 'running' ? 'Läuft' : 
                       automation.status === 'stopped' ? 'Gestoppt' :
                       automation.status === 'error' ? 'Fehler' : 'Warnung'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{automation.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Zuletzt: {automation.lastRun}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4" />
                      <span>{automation.executions} Ausführungen</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => triggerWebhook(automation)}
                    disabled={isLoading === automation.id}
                    className={clsx(
                      'btn-primary flex items-center justify-center space-x-2 min-w-[120px]',
                      isLoading === automation.id && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isLoading === automation.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Läuft...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Auslösen</span>
                      </>
                    )}
                  </button>
                  
                  <button className="btn-secondary">
                    Details
                  </button>
                </div>
              </div>
              
              {/* Webhook URL (collapsible on mobile) */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Webhook URL:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                  {automation.webhookUrl}
                </code>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;