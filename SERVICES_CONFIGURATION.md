# External Services Configuration & Monitoring

## Overview

The External Services section allows you to configure, monitor, and check the health of integrated external services that power your call tracking and AI voice features.

## Features

### 1. **Service Health Monitoring**
- Real-time health checks for Telnyx and ElevenLabs
- Response time tracking
- Visual status indicators (Healthy, Unhealthy, Unconfigured)
- Last checked timestamps
- Individual or bulk service checks

### 2. **Service Configuration**
- Configure API keys and credentials
- Service-specific settings:
  - **Telnyx**: API Key, Public Key
  - **ElevenLabs**: API Key, Voice ID
- Configuration status indicators
- Secure credential management

### 3. **User Interface**
- Accessible from the left sidebar (External Services section)
- Expandable service cards
- Quick health check buttons
- In-line configuration editing
- Documentation links for each service

## Accessing the Feature

1. Navigate to the left sidebar
2. Click on **"External Services"** (Settings icon)
3. View all configured services

## How It Works

### Health Checks

The system performs health checks by:
- **Telnyx**: Pings the Telnyx API to verify connectivity
- **ElevenLabs**: Checks the ElevenLabs API user endpoint

Each health check returns:
- Status: `healthy`, `unhealthy`, or `unconfigured`
- Message: Description of the service state
- Response time: How long the check took (in milliseconds)
- Last checked: Timestamp of the last health check

### Configuration

To configure a service:
1. Click on the service card to expand it
2. Click **"Configure Service"**
3. Enter the required credentials:
   - **Telnyx**: API Key and Public Key
   - **ElevenLabs**: API Key and Voice ID
4. Click **"Save"**

**Note**: For production use, configurations should be managed via environment variables in the `.env` file.

## API Endpoints

### Health Check Endpoints

#### Check Telnyx Health
```
GET /api/health/telnyx
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Telnyx service is operational"
}
```

#### Check ElevenLabs Health
```
GET /api/health/elevenlabs
```

**Response:**
```json
{
  "status": "healthy",
  "message": "ElevenLabs service is operational"
}
```

### Configuration Endpoints

#### Get Service Configurations
```
GET /api/services/config
```

**Response:**
```json
{
  "services": [
    {
      "name": "Telnyx",
      "isConfigured": true,
      "hasPublicKey": true
    },
    {
      "name": "ElevenLabs",
      "isConfigured": true,
      "hasVoiceId": true
    }
  ]
}
```

#### Update Service Configuration
```
PUT /api/services/config/:serviceName
```

**Request Body:**
```json
{
  "apiKey": "your-api-key",
  "voiceId": "voice-id-here",
  "publicKey": "public-key-here"
}
```

## Service Roles

### Telnyx
- **Purpose**: Phone system for inbound call routing
- **Data Collection**: Captures call data from phone sources
- **Integration**: Collects call duration, caller info, outcomes
- **Business Value**: Provides phone-based lead source data alongside other sources like Facebook Ads

### ElevenLabs
- **Purpose**: AI voice synthesis engine
- **Function**: Powers natural-sounding AI voice conversations
- **Integration**: Works with Telnyx to enable AI-powered call handling
- **Business Value**: Enables automated yet natural customer interactions

## Data Source Integration

Yes, inbound calls are collected as a data source similar to Facebook Ads and other marketing channels. The system:

1. **Collects call data** from Telnyx including:
   - Caller information
   - Call duration
   - Call outcomes (Booked, Follow Up, Not Interested)
   - Interest levels (High, Medium, Low)
   - Timestamps

2. **Integrates with analytics** to provide:
   - Call volume trends
   - Conversion rates from phone leads
   - ROI tracking across all sources
   - Territory-based insights

3. **Combines with other sources**:
   - Facebook Ads
   - Google Ads
   - Organic Traffic
   - Direct calls
   - Referrals

This unified view helps business owners understand which channels (including phone) drive the most valuable leads.

## Files Created/Modified

### New Files
1. **`/services/serviceHealthService.ts`**
   - Service health check logic
   - Configuration management
   - API communication for health checks

2. **`/components/ServicesConfig.tsx`**
   - UI component for service configuration
   - Health check interface
   - Configuration form handling

3. **`/SERVICES_CONFIGURATION.md`** (this file)
   - Documentation for the feature

### Modified Files
1. **`/components/Icons.tsx`**
   - Added new icons: ChevronDown, CheckCircle2, XCircle, AlertCircle, Loader, Info

2. **`/components/Sidebar.tsx`**
   - Added "External Services" menu item

3. **`/App.tsx`**
   - Imported ServicesConfig component
   - Added services section to render switch

4. **`/server.js`**
   - Added health check endpoints for Telnyx and ElevenLabs
   - Added configuration status endpoint
   - Added configuration update endpoint

## Testing

### Manual Testing

1. **Access the Section**
   ```
   Navigate to: Sidebar > External Services
   ```

2. **Test Health Checks**
   - Click "Check Health" on individual services
   - Click "Check All Services" to test all at once
   - Verify status indicators update correctly

3. **Test Configuration**
   - Expand a service card
   - Click "Configure Service"
   - Enter test credentials (or leave blank to test unconfigured state)
   - Verify save/cancel functionality

### API Testing

```bash
# Test Telnyx health check
curl http://localhost:3000/api/health/telnyx

# Test ElevenLabs health check
curl http://localhost:3000/api/health/elevenlabs

# Get service configurations
curl http://localhost:3000/api/services/config
```

## Security Considerations

1. **Credentials**: API keys should never be exposed to the client
2. **Environment Variables**: Use `.env` file for sensitive data
3. **HTTPS**: Use HTTPS in production for secure communication
4. **Validation**: Always validate and sanitize configuration inputs
5. **Access Control**: Consider adding authentication for configuration changes

## Future Enhancements

1. **Automated Health Checks**: Schedule periodic health checks
2. **Alert System**: Notify when services go unhealthy
3. **Usage Metrics**: Track API usage and quota
4. **Service Logs**: View recent service activity
5. **Additional Services**: Support for more integrations (Twilio, AWS, etc.)
6. **Configuration History**: Track configuration changes over time
7. **Service Dependencies**: Show which features depend on which services

## Troubleshooting

### Service Shows "Unconfigured"
- Check that environment variables are set in `.env` file
- Restart the server after updating `.env`
- Verify variable names match exactly: `TELNYX_API_KEY`, `ELEVENLABS_API_KEY`, etc.

### Health Check Fails
- Verify API keys are valid and not expired
- Check network connectivity
- Review API quotas and limits
- Check server logs for detailed error messages

### Configuration Not Saving
- Note: Direct UI configuration updates are disabled by default
- Update `.env` file manually and restart server
- Consider implementing secure configuration storage for production

## Support

For issues or questions:
1. Check server logs: `pm2 logs` or console output
2. Review [TELNYX_SETUP.md](./TELNYX_SETUP.md) for integration details
3. Check API documentation:
   - Telnyx: https://developers.telnyx.com
   - ElevenLabs: https://elevenlabs.io/docs
