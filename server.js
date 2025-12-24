
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import db from './database/db.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Database API Routes
app.get('/api/metrics', async (req, res) => {
  try {
    const { category } = req.query;
    const metrics = await db.getCallMetrics(category);
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.get('/api/ai-metrics', async (req, res) => {
  try {
    const metrics = await db.getAiAgentMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching AI metrics:", error);
    res.status(500).json({ error: "Failed to fetch AI metrics" });
  }
});

app.get('/api/agent-outcomes', async (req, res) => {
  try {
    const outcomes = await db.getAgentOutcomes();
    res.json(outcomes);
  } catch (error) {
    console.error("Error fetching agent outcomes:", error);
    res.status(500).json({ error: "Failed to fetch agent outcomes" });
  }
});

app.get('/api/volume-data', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await db.getVolumeData(parseInt(days));
    res.json(data);
  } catch (error) {
    console.error("Error fetching volume data:", error);
    res.status(500).json({ error: "Failed to fetch volume data" });
  }
});

app.get('/api/territories', async (req, res) => {
  try {
    const territories = await db.getTerritories();
    res.json(territories);
  } catch (error) {
    console.error("Error fetching territories:", error);
    res.status(500).json({ error: "Failed to fetch territories" });
  }
});

app.get('/api/recent-calls', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const calls = await db.getRecentCalls(parseInt(limit));
    res.json(calls);
  } catch (error) {
    console.error("Error fetching recent calls:", error);
    res.status(500).json({ error: "Failed to fetch recent calls" });
  }
});

app.get('/api/outcome-data', async (req, res) => {
  try {
    const data = await db.getOutcomeData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching outcome data:", error);
    res.status(500).json({ error: "Failed to fetch outcome data" });
  }
});

app.get('/api/attribution-sources', async (req, res) => {
  try {
    const sources = await db.getAttributionSources();
    res.json(sources);
  } catch (error) {
    console.error("Error fetching attribution sources:", error);
    res.status(500).json({ error: "Failed to fetch attribution sources" });
  }
});

app.get('/api/attribution-trends', async (req, res) => {
  try {
    const trends = await db.getAttributionTrends();
    res.json(trends);
  } catch (error) {
    console.error("Error fetching attribution trends:", error);
    res.status(500).json({ error: "Failed to fetch attribution trends" });
  }
});

app.post('/api/calls', async (req, res) => {
  try {
    const callData = req.body;
    const newCall = await db.addRecentCall(callData);
    res.status(201).json(newCall);
  } catch (error) {
    console.error("Error adding call:", error);
    res.status(500).json({ error: "Failed to add call" });
  }
});

app.put('/api/metrics/:label', async (req, res) => {
  try {
    const { label } = req.params;
    const { value, change } = req.body;
    const updated = await db.updateMetric(label, value, change);
    res.json(updated);
  } catch (error) {
    console.error("Error updating metric:", error);
    res.status(500).json({ error: "Failed to update metric" });
  }
});

// AI Analysis Route
app.post('/api/analyze', async (req, res) => {
  try {
    const { userQuery } = req.body;

    // Fetch data from database
    const [metrics, volumeData, territories, attributionSources] = await Promise.all([
      db.getCallMetrics('main'),
      db.getVolumeData(7),
      db.getTerritories(),
      db.getAttributionSources()
    ]);

    const dataContext = {
      metrics,
      weeklyVolume: volumeData,
      territories,
      marketingChannels: attributionSources
    };

    // Use recommended initialization pattern for @google/genai SDK
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const contextString = JSON.stringify(dataContext);
    
    const basePrompt = `
      Analyze the following business call analytics data for 'Don'.
      
      Data:
      ${contextString}
      
      Task:
      Provide 3 key insights about performance, opportunities, and risks.
      Suggest a relevant follow-up question.
      
      Output JSON format matching the schema.
    `;

    const finalPrompt = userQuery 
      ? `Data context: ${contextString}. \nUser Question: ${userQuery}. \nProvide 3 specific data points or insights that answer the question, and one follow-up question.` 
      : basePrompt;

    // Use gemini-3-flash-preview for text-based analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: { 
              type: Type.STRING, 
              description: "A short context header, e.g., 'Based on the latest data:'" 
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  icon: { 
                    type: Type.STRING, 
                    description: "Select most appropriate visual: 'trending-up', 'users', 'alert', 'check', 'clock'" 
                  },
                  label: { 
                    type: Type.STRING, 
                    description: "The bold topic title, e.g., 'Team Workload', 'Conversion Rate'" 
                  },
                  value: { 
                    type: Type.STRING, 
                    description: "The detailed explanation text." 
                  }
                },
                required: ["icon", "label", "value"]
              }
            },
            followUp: { 
              type: Type.STRING, 
              description: "A suggested next question for the user to ask" 
            }
          },
          required: ["header", "items", "followUp"]
        }
      }
    });

    // Access the text property directly on the GenerateContentResponse object
    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    res.json(JSON.parse(text));

  } catch (error) {
    console.error("Backend Error:", error);
    
    // Handle quota exceeded gracefully
    if (error?.status === 429) {
      return res.status(503).json({ 
        error: 'AI analysis temporarily unavailable due to quota limits. Please try again later.',
        retryAfter: 60 
      });
    }
    
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Call Summary Route
app.post('/api/summarize-call', async (req, res) => {
  try {
    const { call } = req.body;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Based on the following call details, generate a 1-sentence professional summary for a business log. Highlight the primary outcome and the key point discussed.
    
    Call Data:
    - Caller: ${call.caller}
    - Duration: ${call.duration}
    - Status: ${call.outcome}
    - Interest: ${call.interest}
    - Direction: ${call.type}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    const summary = response.text || "Summary unavailable.";
    res.json({ summary });

  } catch (error) {
    console.error("Error generating call summary:", error);
    res.status(500).json({ error: "Failed to generate summary", summary: "Could not generate summary." });
  }
});

// ============================================
// TELNYX + ELEVENLABS INTEGRATION
// ============================================

// Service Health Check Endpoints
app.get('/api/health/telnyx', async (req, res) => {
  try {
    if (!process.env.TELNYX_API_KEY) {
      return res.status(200).json({
        status: 'unconfigured',
        message: 'Telnyx API key not configured'
      });
    }

    // Check Telnyx API connectivity
    const response = await fetch('https://api.telnyx.com/v2/available_phone_numbers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      res.json({
        status: 'healthy',
        message: 'Telnyx service is operational'
      });
    } else {
      res.json({
        status: 'unhealthy',
        message: `Telnyx API returned status ${response.status}`
      });
    }
  } catch (error) {
    console.error('Telnyx health check error:', error);
    res.json({
      status: 'unhealthy',
      message: error.message || 'Failed to connect to Telnyx'
    });
  }
});

app.get('/api/health/elevenlabs', async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(200).json({
        status: 'unconfigured',
        message: 'ElevenLabs API key not configured'
      });
    }

    // Check ElevenLabs API connectivity
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      }
    });

    if (response.ok) {
      res.json({
        status: 'healthy',
        message: 'ElevenLabs service is operational'
      });
    } else {
      res.json({
        status: 'unhealthy',
        message: `ElevenLabs API returned status ${response.status}`
      });
    }
  } catch (error) {
    console.error('ElevenLabs health check error:', error);
    res.json({
      status: 'unhealthy',
      message: error.message || 'Failed to connect to ElevenLabs'
    });
  }
});

// Service Configuration Endpoints
app.get('/api/services/config', (req, res) => {
  res.json({
    services: [
      {
        name: 'Telnyx',
        isConfigured: !!process.env.TELNYX_API_KEY,
        hasPublicKey: !!process.env.TELNYX_PUBLIC_KEY
      },
      {
        name: 'ElevenLabs',
        isConfigured: !!process.env.ELEVENLABS_API_KEY,
        hasVoiceId: !!process.env.ELEVENLABS_VOICE_ID
      }
    ]
  });
});

app.put('/api/services/config/:serviceName', (req, res) => {
  const { serviceName } = req.params;
  const { apiKey, voiceId, publicKey } = req.body;

  // Note: In production, you would want to securely update .env file or use a config management system
  // This is a basic implementation that would need enhancement for production use
  
  res.json({
    success: false,
    message: 'Configuration updates should be done via .env file or environment variables'
  });
});

// Telnyx webhook endpoint for call events (correct path matching Telnyx configuration)
app.post('/api/telnyx/webhook', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Log the full webhook for debugging
    console.log('📥 Telnyx Webhook Received:', JSON.stringify(req.body, null, 2));
    
    // Acknowledge receipt immediately
    res.status(200).json({ received: true });

    if (!data) {
      console.warn('⚠️ No data in webhook payload');
      return;
    }

    const eventType = data.event_type;
    const payload = data.payload;

    console.log(`📞 Telnyx Event: ${eventType}`);
    console.log('📋 Payload:', JSON.stringify(payload, null, 2));

    switch (eventType) {
      case 'call.initiated':
        await handleCallInitiated(payload);
        break;
      case 'call.answered':
        await handleCallAnswered(payload);
        break;
      case 'call.hangup':
        await handleCallHangup(payload);
        break;
      case 'call.recording.saved':
      case 'call.recording.available':
        await handleRecordingAvailable(payload);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error('❌ Telnyx webhook error:', error);
    console.error('Stack:', error.stack);
    // Still return 200 to prevent Telnyx retries
    res.status(200).json({ error: error.message });
  }
});

// Failover webhook endpoint
app.post('/api/telnyx/webhook/failover', async (req, res) => {
  console.log('📥 Telnyx Failover Webhook Received');
  // Use the same handler as primary webhook
  return app._router.handle(Object.assign(req, { url: '/api/telnyx/webhook' }), res);
});

// Legacy endpoint for backward compatibility
app.post('/api/webhooks/telnyx', async (req, res) => {
  console.log('📥 Legacy webhook endpoint called, redirecting...');
  return app._router.handle(Object.assign(req, { url: '/api/telnyx/webhook' }), res);
});

// Store active calls in memory
const activeCalls = new Map();

async function handleCallInitiated(payload) {
  const { call_control_id, from, to, direction } = payload;
  
  activeCalls.set(call_control_id, {
    callControlId: call_control_id,
    from,
    to,
    direction,
    startTime: new Date(),
    status: 'initiated'
  });

  console.log(`Call initiated: ${from} -> ${to}`);
}

async function handleCallAnswered(payload) {
  const { call_control_id } = payload;
  const call = activeCalls.get(call_control_id);
  
  if (call) {
    call.status = 'in-progress';
    call.answeredTime = new Date();
    console.log(`Call answered: ${call.from}`);
  }
}

async function handleCallHangup(payload) {
  const { call_control_id, call_session_id, call_leg_id, hangup_cause, hangup_source, from, to, direction } = payload;
  let call = activeCalls.get(call_control_id);
  
  // Extract AI assistant ID from payload if available
  const assistantId = payload.ai_assistant_id || payload.assistant_id || null;
  const configuredPhone = process.env.TELNYX_PHONE_NUMBER;
  
  // Filter: Only process calls to/from our configured phone number
  if (configuredPhone) {
    const phoneMatch = to?.includes(configuredPhone.replace(/\+/g, '')) || from?.includes(configuredPhone.replace(/\+/g, ''));
    if (!phoneMatch) {
      console.log(`⏭️ Skipping call - phone doesn't match: ${to} / ${from}`);
      activeCalls.delete(call_control_id);
      return;
    }
  }
  
  // Filter: Only process calls from our configured AI assistant
  if (process.env.TELNYX_AI_ASSISTANT_ID && assistantId && assistantId !== process.env.TELNYX_AI_ASSISTANT_ID) {
    console.log(`⏭️ Skipping call from different assistant: ${assistantId}`);
    activeCalls.delete(call_control_id);
    return;
  }
  
  // If call not in memory, reconstruct from payload
  if (!call) {
    console.log('⚠️ Call not found in active calls, reconstructing from payload');
    call = {
      callControlId: call_control_id,
      from: from || 'Unknown',
      to: to || 'Unknown',
      direction: direction || 'incoming',
      startTime: new Date(Date.now() - 60000), // Estimate 1 min ago
      status: 'reconstructed'
    };
  }
  
  const endTime = new Date();
  const duration = Math.round((endTime - call.startTime) / 1000); // seconds
  
  // Determine outcome and interest level
  const outcome = determineOutcome(hangup_cause, duration);
  const interest = determineInterestLevel(duration, hangup_cause);
  const leadQuality = determineLeadQuality(duration, hangup_cause, outcome);
  
  console.log(`📊 Call Stats: Duration=${duration}s, Outcome=${outcome}, Quality=${leadQuality}, Assistant=${assistantId || 'N/A'}`);
  
  // Log to recent_calls table (legacy)
  try {
    await db.addRecentCall({
      caller: formatPhoneNumber(call.from),
      status: outcome,
      interest: interest,
      duration: `${duration}s`,
      insight: `Call ended: ${hangup_cause}`,
      time: endTime.toISOString(),
      type: call.direction === 'incoming' ? 'Inbound' : 'Outbound'
    });

    console.log(`✅ Call logged to recent_calls: ${call.from} - ${duration}s`);
  } catch (error) {
    console.error('❌ Error logging to recent_calls:', error);
  }

  // Log to call_recordings table (new detailed format)
  try {
    const recordingData = {
      call_control_id: call_control_id,
      call_session_id: call_session_id || null,
      call_leg_id: call_leg_id || null,
      from_number: call.from,
      to_number: call.to,
      direction: call.direction,
      start_time: call.startTime,
      answer_time: call.answeredTime || null,
      end_time: endTime,
      duration_seconds: duration,
      status: 'completed',
      hangup_cause: hangup_cause,
      hangup_source: hangup_source,
      ai_assistant_used: !!assistantId,
      ai_assistant_id: assistantId,
      lead_quality: leadQuality,
      appointment_booked: outcome === 'Booked',
      follow_up_required: outcome === 'Follow Up' || outcome === 'Call Back',
      raw_webhook_data: payload
    };
    
    await db.addCallRecording(recordingData);
    console.log(`✅ Call recording logged to database: ${call.from} - ${duration}s - Quality: ${leadQuality}`);
  } catch (error) {
    console.error('❌ Error logging call recording:', error);
    console.error('Error details:', error.message);
  }
  
  activeCalls.delete(call_control_id);
}

async function handleRecordingAvailable(payload) {
  const { call_control_id, recording_urls, public_recording_urls } = payload;
  
  console.log(`🎙️ Recording available for call: ${call_control_id}`);
  
  try {
    const recordingUrl = public_recording_urls?.mp3 || recording_urls?.mp3 || 
                         public_recording_urls?.wav || recording_urls?.wav;
    
    if (recordingUrl) {
      await db.updateCallRecording(call_control_id, {
        recording_url: recordingUrl,
        recording_available: true,
        recording_status: 'available'
      });
      
      console.log(`✅ Recording URL saved: ${recordingUrl}`);
    } else {
      console.warn('⚠️ No recording URL found in payload');
    }
  } catch (error) {
    console.error('❌ Error updating recording URL:', error);
  }
}

function determineLeadQuality(duration, hangupCause, outcome) {
  if (outcome === 'Booked' || duration > 180) return 'Hot';
  if (outcome === 'Follow Up' || (duration > 60 && hangupCause === 'normal')) return 'Warm';
  if (duration > 30) return 'Cold';
  return 'Not Qualified';
}

function determineOutcome(hangupCause, duration) {
  if (duration < 10) return 'Not Interested';
  if (hangupCause === 'normal') {
    if (duration > 120) return 'Booked';
    if (duration > 60) return 'Follow Up';
    return 'Interested';
  }
  return 'Call Back';
}

function determineInterestLevel(duration, hangupCause) {
  if (duration > 120) return 'High';
  if (duration > 60) return 'Medium';
  return 'Low';
}

function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// ElevenLabs text-to-speech endpoint
app.post('/api/tts/elevenlabs', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: 'ElevenLabs API key not configured' });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Get active calls
app.get('/api/calls/active', (req, res) => {
  const calls = Array.from(activeCalls.values());
  res.json(calls);
});

// Call History & Recordings Endpoints
app.get('/api/calls/history', async (req, res) => {
  try {
    const filters = {
      direction: req.query.direction,
      leadQuality: req.query.leadQuality,
      hasRecording: req.query.hasRecording === 'true',
      hasTranscript: req.query.hasTranscript === 'true'
    };
    
    // Always filter by configured AI assistant ID
    if (process.env.TELNYX_AI_ASSISTANT_ID) {
      filters.ai_assistant_id = process.env.TELNYX_AI_ASSISTANT_ID;
      console.log(`📊 Filtering calls by assistant: ${filters.ai_assistant_id}`);
    }

    const calls = await db.getCallRecordings(filters);
    console.log(`✅ Retrieved ${calls.length} calls`);
    res.json(calls);
  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({ error: 'Failed to fetch call history' });
  }
});

app.get('/api/calls/recording/:callControlId', async (req, res) => {
  try {
    const { callControlId } = req.params;
    const call = await db.getCallRecordingByControlId(callControlId);
    
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    console.error('Error fetching call recording:', error);
    res.status(500).json({ error: 'Failed to fetch call recording' });
  }
});

app.post('/api/calls/recording', async (req, res) => {
  try {
    const callData = req.body;
    const savedCall = await db.addCallRecording(callData);
    res.status(201).json(savedCall);
  } catch (error) {
    console.error('Error saving call recording:', error);
    res.status(500).json({ error: 'Failed to save call recording' });
  }
});

app.put('/api/calls/recording/:callControlId', async (req, res) => {
  try {
    const { callControlId } = req.params;
    const updates = req.body;
    const updatedCall = await db.updateCallRecording(callControlId, updates);
    
    if (!updatedCall) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(updatedCall);
  } catch (error) {
    console.error('Error updating call recording:', error);
    res.status(500).json({ error: 'Failed to update call recording' });
  }
});

// Fetch Telnyx call recordings (from Telnyx API)
app.get('/api/telnyx/recordings', async (req, res) => {
  try {
    if (!process.env.TELNYX_API_KEY) {
      return res.status(500).json({ error: 'Telnyx API key not configured' });
    }

    console.log('🔄 Fetching recordings from Telnyx API...');
    const { limit = 50, page = 1 } = req.query;
    
    const response = await fetch(
      `https://api.telnyx.com/v2/recordings?page[size]=${limit}&page[number]=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Telnyx API error: ${response.status}`, errorText);
      throw new Error(`Telnyx API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📥 Fetched ${data.data?.length || 0} recordings from Telnyx`);
    
    // Save recordings to database
    if (data.data && Array.isArray(data.data)) {
      for (const recording of data.data) {
        try {
          await db.addCallRecording({
            call_control_id: recording.call_control_id || recording.id,
            call_session_id: recording.call_session_id,
            call_leg_id: recording.call_leg_id,
            from_number: recording.from,
            to_number: recording.to,
            direction: recording.direction,
            start_time: recording.started_at,
            end_time: recording.completed_at,
            duration_seconds: recording.duration_millis ? Math.floor(recording.duration_millis / 1000) : 0,
            status: recording.status,
            recording_url: recording.download_urls?.mp3 || recording.download_urls?.wav,
            recording_id: recording.id,
            recording_available: recording.status === 'completed',
            raw_webhook_data: recording
          });
          console.log(`✅ Saved recording: ${recording.call_control_id}`);
        } catch (error) {
          console.error(`❌ Error saving recording ${recording.id}:`, error.message);
        }
      }
    }

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching Telnyx recordings:', error);
    res.status(500).json({ error: 'Failed to fetch recordings from Telnyx', details: error.message });
  }
});

// Fetch call history from Telnyx API (using recordings which contain call data)
app.get('/api/telnyx/calls', async (req, res) => {
  try {
    if (!process.env.TELNYX_API_KEY) {
      return res.status(500).json({ error: 'Telnyx API key not configured' });
    }

    console.log('🔄 Syncing call history from Telnyx recordings API...');
    const { limit = 50 } = req.query;
    const configuredAssistantId = process.env.TELNYX_AI_ASSISTANT_ID;
    const configuredPhoneNumber = process.env.TELNYX_PHONE_NUMBER;
    
    console.log(`📋 Filtering by: Assistant=${configuredAssistantId}, Phone=${configuredPhoneNumber}`);
    
    // Use recordings endpoint as it contains call information and actually works
    const response = await fetch(
      `https://api.telnyx.com/v2/recordings?page[size]=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Telnyx API error: ${response.status}`, errorText);
      throw new Error(`Telnyx API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📥 Fetched ${data.data?.length || 0} recordings from Telnyx`);
    
    let savedCount = 0;
    // Save recordings (which include call data) to database
    if (data.data && Array.isArray(data.data)) {
      console.log(`\n📋 Analyzing ${data.data.length} recordings for phone: ${configuredPhoneNumber}`);
      
      for (const recording of data.data) {
        try {
          console.log(`\n🔍 Recording ${recording.id}:`);
          console.log(`   From: ${recording.from}`);
          console.log(`   To: ${recording.to}`);
          console.log(`   Conference: ${recording.conference_id}`);
          
          // Filter: Check if recording involves our configured phone number
          const configuredPhoneClean = configuredPhoneNumber?.replace(/[^0-9]/g, '');
          const fromClean = recording.from?.replace(/[^0-9]/g, '') || '';
          const toClean = recording.to?.replace(/[^0-9]/g, '') || '';
          
          console.log(`   Checking: ${configuredPhoneClean} in from(${fromClean}) or to(${toClean})`);
          
          // Skip if neither from nor to matches our phone
          if (configuredPhoneClean && !fromClean.includes(configuredPhoneClean) && !toClean.includes(configuredPhoneClean)) {
            console.log(`   ❌ SKIP: Phone doesn't match`);
            continue; // Skip silently if phone doesn't match
          }
          
          console.log(`   ✅ Phone matches!`);
          
          // Extract assistant ID from recording metadata, conference_id, or other fields
          let assistantId = null;
          if (recording.conference_id?.includes('assistant-')) {
            assistantId = recording.conference_id.match(/assistant-[a-f0-9-]+/)?.[0];
          } else if (recording.metadata?.assistant_id) {
            assistantId = recording.metadata.assistant_id;
          } else if (recording.tags?.some(t => t.includes('assistant-'))) {
            assistantId = recording.tags.find(t => t.includes('assistant-'));
          }
          
          // If assistant ID configured but recording doesn't have one, use configured as default
          // (Telnyx may not always include assistant ID in recording metadata)
          if (!assistantId && configuredAssistantId) {
            assistantId = configuredAssistantId;
            console.log(`ℹ️ Recording ${recording.id} has no assistant ID, using configured: ${configuredAssistantId}`);
          }
          
          // If we still don't have an assistant ID and one is required, skip
          if (!assistantId && configuredAssistantId) {
            console.log(`⏭️ Skipping recording ${recording.id} - no assistant ID found`);
            continue;
          }
          
          console.log(`✅ Processing recording: ${recording.id} (from: ${recording.from}, to: ${recording.to})`);
          
          // Extract timestamps from recording - prioritize recording_started_at/recording_ended_at
          const startTime = new Date(recording.recording_started_at || recording.started_at || recording.created_at);
          const endTime = recording.recording_ended_at ? new Date(recording.recording_ended_at) : 
                         recording.completed_at ? new Date(recording.completed_at) : null;
          const duration = recording.duration_millis ? Math.floor(recording.duration_millis / 1000) : 0;
          
          // Map direction to match database constraint
          let direction = recording.direction || 'incoming';
          if (direction === 'inbound') direction = 'incoming';
          if (direction === 'outbound') direction = 'outgoing';
          
          await db.addCallRecording({
            call_control_id: recording.call_control_id || recording.id,
            call_session_id: recording.call_session_id,
            call_leg_id: recording.call_leg_id,
            from_number: recording.from || 'Unknown',
            to_number: recording.to || 'Unknown',
            direction: direction,
            start_time: recording.started_at || recording.created_at,
            answer_time: recording.started_at,
            end_time: recording.completed_at,
            duration_seconds: duration,
            status: recording.status || 'completed',
            recording_url: recording.download_urls?.mp3 || recording.download_urls?.wav,
            recording_id: recording.id,
            recording_duration: duration,
            recording_status: recording.status,
            recording_available: true,
            ai_assistant_used: true,
            ai_assistant_id: assistantId,
            lead_quality: determineLeadQuality(duration, null, determineOutcome(null, duration)),
            raw_webhook_data: recording
          });
          savedCount++;
        } catch (error) {
          console.error(`❌ Error saving recording ${recording.id}:`, error.message);
        }
      }
    }

    console.log(`✅ Synced ${savedCount} call recordings from Telnyx`);
    res.json({ 
      success: true,
      total: data.data?.length || 0,
      saved: savedCount,
      message: `Successfully synced ${savedCount} call recordings from Telnyx`
    });
  } catch (error) {
    console.error('❌ Error syncing from Telnyx:', error);
    res.status(500).json({ error: 'Failed to sync from Telnyx', details: error.message });
  }
});

// Manual call logging endpoint
app.post('/api/calls/log', async (req, res) => {
  try {
    const { phoneNumber, duration, outcome, notes } = req.body;
    
    await db.addRecentCall({
      caller: formatPhoneNumber(phoneNumber),
      status: outcome || 'Follow Up',
      interest: duration > 120 ? 'High' : duration > 60 ? 'Medium' : 'Low',
      duration: `${duration}s`,
      insight: notes || 'Manually logged call',
      time: new Date().toISOString(),
      type: 'Inbound'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging call manually:', error);
    res.status(500).json({ error: 'Failed to log call' });
  }
});

// Catch-all route to serve React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
