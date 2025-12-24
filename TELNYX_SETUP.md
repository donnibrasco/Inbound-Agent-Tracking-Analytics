# Telnyx + ElevenLabs Integration Setup

## Overview
Your Call Insights Hub is now ready to receive real-time call data from Telnyx and use ElevenLabs for AI voice responses.

## 1. Configure Environment Variables

Edit `/root/Inbound-Agent-Tracking-Analytics/.env` and add your API keys:

```bash
TELNYX_API_KEY=your_telnyx_api_key_here
TELNYX_PUBLIC_KEY=your_telnyx_public_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
```

### Where to get these:
- **Telnyx API Key**: https://portal.telnyx.com/#/app/api-keys
- **ElevenLabs API Key**: https://elevenlabs.io/app/settings/api-keys
- **ElevenLabs Voice ID**: https://elevenlabs.io/app/voice-library

## 2. Configure Telnyx Webhooks

1. Go to https://portal.telnyx.com/#/app/call-control/applications
2. Create or edit your Call Control Application
3. Set the webhook URL to:
   ```
   https://calleraiagent.my/api/webhooks/telnyx
   ```
4. Enable these webhook events:
   - `call.initiated`
   - `call.answered`
   - `call.hangup`
   - `call.speak.ended` (optional)
5. Set Webhook API Version to **V2**
6. Save the application

## 3. Test the Integration

### Test Webhook (simulate a call):
```bash
curl -X POST https://calleraiagent.my/api/webhooks/telnyx \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "event_type": "call.hangup",
      "payload": {
        "call_control_id": "test-123",
        "from": "+15551234567",
        "to": "+15559876543",
        "direction": "incoming",
        "hangup_cause": "normal"
      }
    }
  }'
```

### Test ElevenLabs TTS:
```bash
curl -X POST https://calleraiagent.my/api/tts/elevenlabs \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, thank you for calling!"}' \
  --output test.mp3
```

### View Active Calls:
```bash
curl https://calleraiagent.my/api/calls/active
```

### Manual Call Logging:
```bash
curl -X POST https://calleraiagent.my/api/calls/log \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+15551234567",
    "duration": 125,
    "outcome": "Booked",
    "notes": "Customer interested in premium package"
  }'
```

## 4. Available API Endpoints

### Webhooks
- `POST /api/webhooks/telnyx` - Receives call events from Telnyx

### Call Management
- `GET /api/calls/active` - Get currently active calls
- `POST /api/calls/log` - Manually log a call

### Voice AI
- `POST /api/tts/elevenlabs` - Convert text to speech using ElevenLabs

## 5. Call Data Flow

```
Telnyx Call → Webhook → Server Processing → Database → Dashboard Update
```

1. **Call Initiated**: Telnyx sends webhook, call tracked in memory
2. **Call Answered**: Status updated to "in-progress"
3. **Call Hangup**: Duration calculated, outcome determined, logged to database
4. **Dashboard**: Real-time display in "Live Call Log" section

## 6. Automatic Call Categorization

The system automatically determines:

### Outcome (Status)
- **Booked**: Call duration > 2 minutes
- **Follow Up**: Duration 1-2 minutes
- **Interested**: Duration > 1 minute
- **Call Back**: Other outcomes
- **Not Interested**: Duration < 10 seconds

### Interest Level
- **High**: Duration > 2 minutes
- **Medium**: Duration 1-2 minutes
- **Low**: Duration < 1 minute

## 7. Monitoring

Check server logs for call events:
```bash
pm2 logs call-insights-hub --lines 50
```

View recent calls in database:
```bash
psql -U call_insights_user -d call_insights_hub -c "SELECT * FROM recent_calls ORDER BY time DESC LIMIT 10;"
```

## 8. Security Notes

- Webhook endpoint is public but validates Telnyx signature (recommended to add)
- API keys are stored securely in `.env` file
- All calls are logged with timestamps for audit trail
- Consider adding Telnyx webhook signature verification for production

## 9. Next Steps

1. Add your actual API keys to `.env`
2. Restart the server: `pm2 restart call-insights-hub`
3. Configure Telnyx webhook URL
4. Make a test call to your Telnyx number
5. Watch the dashboard update in real-time!

## 10. Troubleshooting

**Webhooks not receiving:**
- Check Telnyx webhook configuration
- Verify URL is accessible: `curl https://calleraiagent.my/api/webhooks/telnyx`
- Check server logs: `pm2 logs`

**ElevenLabs not working:**
- Verify API key is correct
- Check voice ID matches an existing voice
- Ensure API key has TTS permissions

**Calls not appearing in dashboard:**
- Verify database connection
- Check `recent_calls` table: `psql -U call_insights_user -d call_insights_hub`
- Refresh the dashboard
