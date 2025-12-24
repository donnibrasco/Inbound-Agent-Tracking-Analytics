import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import serviceHealthService, { ServiceStatus, ServiceConfig } from '../services/serviceHealthService';

const ServicesConfig: React.FC = () => {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [configForms, setConfigForms] = useState<Record<string, any>>({});

  useEffect(() => {
    loadServiceData();
  }, []);

  const loadServiceData = async () => {
    try {
      const configs = await serviceHealthService.getServiceConfigurations();
      setServiceConfigs(configs);
      
      // Initialize config forms
      const forms: Record<string, any> = {};
      configs.forEach(config => {
        forms[config.name] = {
          apiKey: config.apiKey || '',
          voiceId: config.voiceId || '',
          publicKey: config.publicKey || ''
        };
      });
      setConfigForms(forms);
    } catch (error) {
      console.error('Error loading service data:', error);
    }
  };

  const handleHealthCheck = async (serviceName?: string) => {
    setLoading(true);
    try {
      let statuses: ServiceStatus[];
      
      if (serviceName) {
        // Check single service
        if (serviceName === 'Telnyx') {
          const status = await serviceHealthService.checkTelnyxHealth();
          statuses = [status, ...serviceStatuses.filter(s => s.name !== 'Telnyx')];
        } else if (serviceName === 'ElevenLabs') {
          const status = await serviceHealthService.checkElevenLabsHealth();
          statuses = [status, ...serviceStatuses.filter(s => s.name !== 'ElevenLabs')];
        } else {
          statuses = serviceStatuses;
        }
      } else {
        // Check all services
        statuses = await serviceHealthService.checkAllServices();
      }
      
      setServiceStatuses(statuses);
    } catch (error) {
      console.error('Error checking service health:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (serviceName: string, field: string, value: string) => {
    setConfigForms(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        [field]: value
      }
    }));
  };

  const handleSaveConfig = async (serviceName: string) => {
    try {
      const config = configForms[serviceName];
      const success = await serviceHealthService.updateServiceConfig(serviceName, config);
      
      if (success) {
        alert(`${serviceName} configuration updated successfully!`);
        setEditMode(null);
        await loadServiceData();
      } else {
        alert(`Failed to update ${serviceName} configuration.`);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('An error occurred while saving configuration.');
    }
  };

  const getStatusColor = (status?: 'healthy' | 'unhealthy' | 'checking' | 'unconfigured') => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-500';
      case 'unhealthy':
        return 'text-red-500';
      case 'checking':
        return 'text-yellow-500';
      case 'unconfigured':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status?: 'healthy' | 'unhealthy' | 'checking' | 'unconfigured') => {
    switch (status) {
      case 'healthy':
        return <Icons.CheckCircle2 size={16} className="text-emerald-500" />;
      case 'unhealthy':
        return <Icons.XCircle size={16} className="text-red-500" />;
      case 'checking':
        return <Icons.Loader size={16} className="text-yellow-500 animate-spin" />;
      default:
        return <Icons.AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const renderServiceCard = (config: ServiceConfig) => {
    const status = serviceStatuses.find(s => s.name === config.name);
    const isExpanded = expandedService === config.name;
    const isEditing = editMode === config.name;
    const form = configForms[config.name] || {};

    return (
      <div key={config.name} className="bg-foreground/5 rounded-xl border border-border overflow-hidden">
        {/* Service Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                {config.name === 'Telnyx' ? (
                  <Icons.Phone size={20} className="text-accent" />
                ) : (
                  <Icons.Mic size={20} className="text-accent" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{config.name}</h3>
                <p className="text-xs text-gray-500">
                  {config.name === 'Telnyx' ? 'Phone System' : 'Voice AI'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setExpandedService(isExpanded ? null : config.name)}
              className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            >
              <Icons.ChevronDown 
                size={20} 
                className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Status Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status?.status)}
              <span className={`text-sm font-medium ${getStatusColor(status?.status)}`}>
                {status?.status === 'healthy' ? 'Healthy' : 
                 status?.status === 'unhealthy' ? 'Unhealthy' : 
                 status?.status === 'checking' ? 'Checking...' : 
                 'Not Checked'}
              </span>
            </div>
            
            <button
              onClick={() => handleHealthCheck(config.name)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Icons.Activity size={14} />
              Check Health
            </button>
          </div>

          {status && (
            <div className="mt-2 text-xs text-gray-500">
              {status.message}
              {status.responseTime && (
                <span className="ml-2">({status.responseTime}ms)</span>
              )}
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border p-4 space-y-4">
            {/* Configuration Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Configuration Status:</span>
              <span className={`text-sm font-medium ${config.isConfigured ? 'text-emerald-500' : 'text-yellow-500'}`}>
                {config.isConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>

            {/* Configuration Fields */}
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={form.apiKey || ''}
                    onChange={(e) => handleConfigChange(config.name, 'apiKey', e.target.value)}
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {config.name === 'ElevenLabs' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Voice ID
                    </label>
                    <input
                      type="text"
                      value={form.voiceId || ''}
                      onChange={(e) => handleConfigChange(config.name, 'voiceId', e.target.value)}
                      placeholder="Enter voice ID"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}

                {config.name === 'Telnyx' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Public Key
                    </label>
                    <input
                      type="text"
                      value={form.publicKey || ''}
                      onChange={(e) => handleConfigChange(config.name, 'publicKey', e.target.value)}
                      placeholder="Enter public key"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveConfig(config.name)}
                    className="flex-1 px-3 py-2 bg-accent hover:bg-accent/90 text-background rounded-lg text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(null);
                      loadServiceData(); // Reset form
                    }}
                    className="flex-1 px-3 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setEditMode(config.name)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg text-sm font-medium transition-colors"
                >
                  <Icons.Settings size={14} />
                  Configure Service
                </button>

                {status?.lastChecked && (
                  <div className="text-xs text-gray-500 text-center">
                    Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}

            {/* Documentation Link */}
            <div className="pt-3 border-t border-border">
              <a
                href={config.name === 'Telnyx' 
                  ? 'https://developers.telnyx.com' 
                  : 'https://elevenlabs.io/docs'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-accent hover:underline"
              >
                <Icons.ExternalLink size={12} />
                View {config.name} Documentation
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">External Services</h2>
        <p className="text-gray-500">
          Configure and monitor external services that power your call tracking and AI voice features.
        </p>
      </div>

      {/* Check All Button */}
      <div className="flex justify-end">
        <button
          onClick={() => handleHealthCheck()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Icons.RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Check All Services
        </button>
      </div>

      {/* Service Cards */}
      <div className="space-y-4">
        {serviceConfigs.length > 0 ? (
          serviceConfigs.map(config => renderServiceCard(config))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Icons.AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No services configured</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <Icons.Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-1">About Service Integration</p>
            <p className="text-xs leading-relaxed">
              <strong>Telnyx</strong> handles inbound call routing and data collection from phone sources, 
              while <strong>ElevenLabs</strong> powers AI voice synthesis for natural conversations. 
              Both services work together to collect valuable call data that integrates with your 
              other sources like Facebook Ads, providing comprehensive business insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesConfig;
