#!/bin/bash

# Test Telnyx Call History & Recordings Integration
# This script simulates Telnyx webhooks to test the call recording feature

API_URL="${API_URL:-http://localhost:3000}"

echo "🧪 Testing Call History & Recordings Integration"
echo "=================================================="
echo ""

# Test 1: Simulate Call Initiated
echo "📞 Test 1: Call Initiated Event"
CALL_ID="test-call-$(date +%s)"
curl -X POST "$API_URL/api/webhooks/telnyx" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "event_type": "call.initiated",
      "payload": {
        "call_control_id": "'"$CALL_ID"'",
        "from": "+15551234567",
        "to": "+15559876543",
        "direction": "incoming",
        "state": "parked"
      }
    }
  }'
echo -e "\n✅ Call initiated\n"
sleep 2

# Test 2: Simulate Call Answered
echo "📞 Test 2: Call Answered Event"
curl -X POST "$API_URL/api/webhooks/telnyx" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "event_type": "call.answered",
      "payload": {
        "call_control_id": "'"$CALL_ID"'",
        "state": "active"
      }
    }
  }'
echo -e "\n✅ Call answered\n"
sleep 5

# Test 3: Simulate Call Hangup with Recording
echo "📞 Test 3: Call Hangup Event"
curl -X POST "$API_URL/api/webhooks/telnyx" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "event_type": "call.hangup",
      "payload": {
        "call_control_id": "'"$CALL_ID"'",
        "hangup_cause": "normal",
        "hangup_source": "caller",
        "state": "hangup"
      }
    }
  }'
echo -e "\n✅ Call hangup processed\n"

# Test 4: Add Call Recording Directly
echo "📞 Test 4: Direct Call Recording Creation"
curl -X POST "$API_URL/api/calls/recording" \
  -H "Content-Type: application/json" \
  -d '{
    "call_control_id": "test-recording-'"$(date +%s)"'",
    "from_number": "+15551112222",
    "to_number": "+15559998888",
    "direction": "incoming",
    "start_time": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'",
    "duration_seconds": 125,
    "status": "completed",
    "hangup_cause": "normal",
    "ai_assistant_used": true,
    "ai_summary": "Customer inquired about service pricing. Expressed high interest in premium plan. Appointment scheduled for next Tuesday.",
    "ai_sentiment": "positive",
    "ai_outcome": "Appointment Scheduled",
    "recording_url": "https://example.com/recordings/sample.mp3",
    "recording_available": true,
    "transcript": "Agent: Hello, thank you for calling. How can I help you today?\nCaller: Hi, I wanted to know about your pricing for the premium service.\nAgent: Of course! Our premium service starts at $299 per month...",
    "transcript_available": true,
    "caller_name": "John Doe",
    "lead_quality": "Hot",
    "appointment_booked": true,
    "follow_up_required": false
  }'
echo -e "\n✅ Recording created directly\n"

# Test 5: Fetch Call History
echo "📊 Test 5: Fetching Call History"
curl -X GET "$API_URL/api/calls/history?direction=all" \
  -H "Content-Type: application/json"
echo -e "\n✅ Call history retrieved\n"

# Test 6: Test with Recording Filter
echo "📊 Test 6: Fetching Calls with Recordings"
curl -X GET "$API_URL/api/calls/history?hasRecording=true" \
  -H "Content-Type: application/json"
echo -e "\n✅ Filtered call history retrieved\n"

echo ""
echo "=================================================="
echo "✅ All tests completed!"
echo ""
echo "🔍 Check your application at: $API_URL"
echo "📱 Navigate to 'Call History' section to see results"
echo ""
echo "💡 Tips:"
echo "   - Check server logs: pm2 logs call-insights-hub"
echo "   - Check database: SELECT * FROM call_recordings;"
echo "   - Refresh the Call History page to see new entries"
echo ""
