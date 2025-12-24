#!/bin/bash

echo "======================================"
echo "Telnyx + ElevenLabs Integration Test"
echo "======================================"
echo ""

# Test 1: Simulate incoming call webhook
echo "1. Testing Telnyx webhook (simulating incoming call)..."
curl -X POST https://calleraiagent.my/api/webhooks/telnyx \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "event_type": "call.hangup",
      "payload": {
        "call_control_id": "test-'$(date +%s)'",
        "from": "+15551234567",
        "to": "+15559876543",
        "direction": "incoming",
        "hangup_cause": "normal"
      }
    }
  }' 2>/dev/null

echo ""
echo ""

# Test 2: Check active calls
echo "2. Checking active calls..."
curl -s https://calleraiagent.my/api/calls/active | jq '.' 2>/dev/null || curl -s https://calleraiagent.my/api/calls/active

echo ""
echo ""

# Test 3: Manual call logging
echo "3. Testing manual call logging..."
curl -X POST https://calleraiagent.my/api/calls/log \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+15557890123",
    "duration": 145,
    "outcome": "Booked",
    "notes": "Customer interested in premium package - follow up next week"
  }' 2>/dev/null

echo ""
echo ""

# Test 4: Check recent calls from database
echo "4. Checking recent calls in database..."
PGPASSWORD=SecurePass123 psql -U call_insights_user -d call_insights_hub -c "SELECT caller, outcome, interest, duration, LEFT(time, 19) as time FROM recent_calls ORDER BY time DESC LIMIT 5;" -t

echo ""
echo "======================================"
echo "Integration test complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Add your API keys to .env file"
echo "2. Check dashboard at: https://calleraiagent.my"
echo "3. See TELNYX_SETUP.md for full instructions"
