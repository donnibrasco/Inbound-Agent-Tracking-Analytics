# Call History & Recordings Integration Guide

## Overview

This feature provides complete call history and recording management from your Telnyx AI Assistant, allowing you to:
- View all inbound and outbound calls
- Play and download call recordings
- Read AI-generated transcripts
- Track lead quality and outcomes
- Monitor AI assistant performance
- Schedule follow-ups

## Features

### 📞 Complete Call History
- All calls from your Telnyx AI Assistant in one place
- Real-time synchronization with Telnyx API
- Detailed call information including caller ID, duration, timestamps
- Direction indicators (Inbound/Outbound)

### 🎙️ Call Recordings
- Play recordings directly in the browser
- Download recordings for offline access
- Audio player with pause/resume controls
- Recording availability status

### 📝 AI-Generated Transcripts
- Full call transcripts from Telnyx AI
- Searchable and readable format
- Expandable/collapsible view
- Transcript availability indicators

### 🎯 Lead Quality Tracking
- Automatic lead scoring (Hot, Warm, Cold, Not Qualified)
- AI sentiment analysis (Positive, Negative, Neutral)
- Appointment booking status
- Follow-up requirement flags

### 🔍 Advanced Filtering
- Filter by call direction (Inbound/Outbound)
- Filter by lead quality
- Show only calls with recordings
- Show only calls with transcripts
- Date range filtering (coming soon)

### 📊 Quick Statistics
- Total calls count
- Recordings available
- Transcripts available
- Appointments booked

## Setup Instructions

### 1. Database Setup

Run the initialization script to create the database table:

```bash
cd /root/Inbound-Agent-Tracking-Analytics
./init-call-recordings.sh
```

Or manually run the SQL schema:

```bash
psql -U call_insights_user -d call_insights_hub -f database/call_recordings_schema.sql
```

### 2. Telnyx Configuration

#### Enable Call Recording in Telnyx

1. Log in to [Telnyx Portal](https://portal.telnyx.com)
2. Go to **Call Control** > **Applications**
3. Select your application
4. Enable **Call Recording**:
   - Recording Format: MP3 (recommended) or WAV
   - Recording Channels: Single or Dual
   - Auto-record: Enable for automatic recording

#### Configure AI Assistant

1. In Telnyx Portal, go to **AI & Voice**
2. Create or configure your AI Assistant
3. Enable these features:
   - **Transcription**: For call transcripts
   - **Sentiment Analysis**: For call sentiment
   - **Intent Detection**: For understanding caller intent
   - **Outcome Tracking**: For tracking call results

#### Update Webhook URLs

Ensure your webhook URL is set correctly in Telnyx:

```
https://your-domain.com/api/webhooks/telnyx
```

Enable these webhook events:
- `call.initiated`
- `call.answered`
- `call.hangup`
- `call.recording.available` (optional, for recording status)
- `call.transcription.available` (optional, for transcript updates)

### 3. Environment Variables

Ensure these are set in your `.env` file:

```env
TELNYX_API_KEY=your_telnyx_api_key_here
TELNYX_PUBLIC_KEY=your_telnyx_public_key_here
```

### 4. Restart Your Application

```bash
pm2 restart call-insights-hub
# or
npm run start
```

## Using the Feature

### Accessing Call History

1. Navigate to the application
2. Click **"Call History"** in the left sidebar
3. View all your calls with recordings

### Playing a Recording

1. Find the call you want to listen to
2. Click the **"Play Recording"** button
3. Use Pause/Play controls as needed
4. Recording plays in-browser, no download required

### Downloading a Recording

1. Click the **"Download"** button next to any call
2. Recording saves as: `call-{phone}-{timestamp}.mp3`
3. File downloads to your browser's download folder

### Viewing Transcripts

1. Click **"View Transcript"** on any call with a transcript
2. Transcript expands below the call details
3. Click **"Hide Transcript"** to collapse

### Filtering Calls

Use the filter bar at the top:
- **Direction**: All Calls, Inbound Only, Outbound Only
- **Lead Quality**: All, Hot, Warm, Cold, Not Qualified
- **Has Recording**: Show only calls with recordings
- **Has Transcript**: Show only calls with transcripts

Click **"Clear Filters"** to reset all filters.

### Refreshing Data

Click the **"Refresh"** button to sync latest calls from Telnyx.

## API Endpoints

### Get Call History
```http
GET /api/calls/history
Query Parameters:
  - direction: incoming|outgoing|all
  - leadQuality: Hot|Warm|Cold|Not Qualified
  - hasRecording: true|false
  - hasTranscript: true|false
```

### Get Specific Call
```http
GET /api/calls/recording/:callControlId
```

### Add Call Recording
```http
POST /api/calls/recording
Body: Call recording data object
```

### Update Call Recording
```http
PUT /api/calls/recording/:callControlId
Body: Fields to update
```

### Sync from Telnyx
```http
GET /api/telnyx/recordings?limit=50&page=1
```

## Database Schema

The `call_recordings` table stores:

- **Call Details**: Control ID, session ID, phone numbers, direction
- **Timing**: Start time, answer time, end time, duration
- **Status**: Call status, hangup cause, hangup source
- **AI Data**: Conversation ID, summary, sentiment, intent, outcome
- **Recording**: URL, ID, duration, status, availability
- **Transcript**: Full text, availability
- **Business Data**: Caller name, company, lead quality, appointment status
- **Follow-up**: Follow-up required, follow-up date
- **Metadata**: Tags, notes, cost tracking, raw webhook data

## Webhook Processing

When Telnyx sends webhooks, the system:

1. **Call Initiated**: Records call start, stores basic info
2. **Call Answered**: Updates with answer time
3. **Call Hangup**: 
   - Calculates duration
   - Determines lead quality
   - Saves to both `recent_calls` and `call_recordings` tables
   - Stores all metadata

4. **Recording Available**: Updates recording URL and status (if webhook enabled)
5. **Transcript Available**: Updates transcript text (if webhook enabled)

## Lead Quality Scoring

Automatic lead quality determination based on:

- **Hot**: 
  - Duration > 3 minutes (180 seconds)
  - Appointment booked
  
- **Warm**: 
  - Duration > 1 minute (60 seconds)
  - Normal hangup
  - Follow-up required
  
- **Cold**: 
  - Duration > 30 seconds
  - Some engagement but no booking
  
- **Not Qualified**: 
  - Duration < 30 seconds
  - Quick hangup

## Troubleshooting

### Calls Not Appearing

1. **Check Telnyx Webhooks**:
   - Verify webhook URL is correct
   - Check webhook events are enabled
   - Review webhook logs in Telnyx Portal

2. **Check Server Logs**:
   ```bash
   pm2 logs call-insights-hub
   ```

3. **Verify Database**:
   ```bash
   psql -U call_insights_user -d call_insights_hub
   SELECT COUNT(*) FROM call_recordings;
   ```

### Recordings Not Available

1. **Check Telnyx Recording Settings**:
   - Ensure auto-record is enabled
   - Verify recording format is set
   - Check storage settings

2. **Webhook Delays**:
   - Recordings may take 30-60 seconds to process
   - Click refresh after waiting

3. **API Key Permissions**:
   - Ensure API key has recording access

### Transcripts Missing

1. **Enable Transcription in Telnyx**:
   - Go to AI Assistant settings
   - Enable transcription feature
   - Select language

2. **Check AI Assistant**:
   - Verify AI assistant is active on calls
   - Check AI assistant configuration

### Performance Issues

1. **Limit Results**:
   - Use filters to reduce data load
   - Pagination coming in future updates

2. **Database Indexes**:
   - Indexes are created automatically
   - Run ANALYZE on table if slow

## Data Storage & Retention

- **Local Database**: All call data stored in PostgreSQL
- **Recordings**: URLs point to Telnyx storage (typically 90 days)
- **Download Recommendation**: Download important recordings for long-term storage
- **Privacy**: Ensure compliance with call recording laws in your jurisdiction

## Privacy & Compliance

⚠️ **Important**: 
- Inform callers that calls are being recorded (required by law in many jurisdictions)
- Use Telnyx's built-in announcement features
- Review your local call recording regulations
- Implement proper data retention policies
- Secure access to recordings and transcripts

## Future Enhancements

Planned features:
- 🔍 Search within transcripts
- 📅 Date range filtering
- 📊 Advanced analytics on call data
- 🏷️ Custom tags and categories
- 📧 Email notifications for important calls
- 📱 Export to CRM systems
- 🤖 Advanced AI insights and recommendations
- 📈 Call quality scoring
- 👥 Multi-user access with permissions

## Support

For issues or questions:
1. Check server logs: `pm2 logs`
2. Review Telnyx webhook logs
3. Check database connectivity
4. Verify Telnyx API key permissions
5. Consult [Telnyx Documentation](https://developers.telnyx.com)

## Summary

The Call History & Recordings feature provides a comprehensive view of all your Telnyx AI Assistant calls with:
- ✅ Complete call history
- ✅ Playable recordings
- ✅ AI transcripts
- ✅ Lead quality tracking
- ✅ Advanced filtering
- ✅ Follow-up management
- ✅ Integration with existing analytics

This data integrates seamlessly with your other lead sources (Facebook Ads, Google Ads, etc.) to provide complete business insights.
