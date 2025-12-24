/**
 * Service Health Check Service
 * Monitors health and connectivity of external services
 */

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'checking' | 'unconfigured';
  message: string;
  lastChecked?: Date;
  responseTime?: number;
}

export interface ServiceConfig {
  name: string;
  apiKey?: string;
  voiceId?: string;
  publicKey?: string;
  isConfigured: boolean;
}

class ServiceHealthService {
  private readonly API_BASE = '/api';

  /**
   * Check Telnyx service health
   */
  async checkTelnyxHealth(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.API_BASE}/health/telnyx`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.status === 'healthy') {
        return {
          name: 'Telnyx',
          status: 'healthy',
          message: data.message || 'Connected successfully',
          lastChecked: new Date(),
          responseTime
        };
      } else {
        return {
          name: 'Telnyx',
          status: 'unhealthy',
          message: data.message || 'Service unavailable',
          lastChecked: new Date(),
          responseTime
        };
      }
    } catch (error) {
      return {
        name: 'Telnyx',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date()
      };
    }
  }

  /**
   * Check ElevenLabs service health
   */
  async checkElevenLabsHealth(): Promise<ServiceStatus> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.API_BASE}/health/elevenlabs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.status === 'healthy') {
        return {
          name: 'ElevenLabs',
          status: 'healthy',
          message: data.message || 'Connected successfully',
          lastChecked: new Date(),
          responseTime
        };
      } else {
        return {
          name: 'ElevenLabs',
          status: 'unhealthy',
          message: data.message || 'Service unavailable',
          lastChecked: new Date(),
          responseTime
        };
      }
    } catch (error) {
      return {
        name: 'ElevenLabs',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date()
      };
    }
  }

  /**
   * Check all services health
   */
  async checkAllServices(): Promise<ServiceStatus[]> {
    const [telnyxStatus, elevenLabsStatus] = await Promise.all([
      this.checkTelnyxHealth(),
      this.checkElevenLabsHealth()
    ]);

    return [telnyxStatus, elevenLabsStatus];
  }

  /**
   * Get service configuration status
   */
  async getServiceConfigurations(): Promise<ServiceConfig[]> {
    try {
      const response = await fetch(`${this.API_BASE}/services/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.services || [];
      }
      
      // Fallback to checking environment
      return this.checkLocalConfig();
    } catch (error) {
      console.error('Error fetching service configurations:', error);
      return this.checkLocalConfig();
    }
  }

  /**
   * Check local environment configuration
   */
  private checkLocalConfig(): ServiceConfig[] {
    return [
      {
        name: 'Telnyx',
        isConfigured: false, // Will be determined by backend
      },
      {
        name: 'ElevenLabs',
        isConfigured: false, // Will be determined by backend
      }
    ];
  }

  /**
   * Update service configuration
   */
  async updateServiceConfig(serviceName: string, config: Partial<ServiceConfig>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/services/config/${serviceName.toLowerCase()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      return response.ok;
    } catch (error) {
      console.error(`Error updating ${serviceName} configuration:`, error);
      return false;
    }
  }
}

export default new ServiceHealthService();
