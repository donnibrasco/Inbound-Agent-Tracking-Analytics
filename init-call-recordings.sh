#!/bin/bash

# Initialize Call Recordings Database Table
# This script creates the call_recordings table for storing Telnyx AI Assistant call history

echo "🚀 Initializing Call Recordings Database..."

# Database connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-call_insights_hub}"
DB_USER="${DB_USER:-call_insights_user}"

echo "📊 Creating call_recordings table..."

# Execute the schema file
PGPASSWORD="${DB_PASSWORD:-SecurePass123}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f database/call_recordings_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Call recordings table created successfully!"
    echo ""
    echo "📋 Table Features:"
    echo "   - Stores complete call history from Telnyx"
    echo "   - Includes call recordings and transcripts"
    echo "   - Tracks AI assistant interactions"
    echo "   - Monitors lead quality and outcomes"
    echo "   - Supports follow-up scheduling"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Ensure your Telnyx webhooks are configured"
    echo "   2. Set up recording rules in your Telnyx account"
    echo "   3. Enable AI assistant in your Telnyx call flow"
    echo "   4. View call history in the 'Call History' section of the app"
    echo ""
else
    echo "❌ Failed to create call recordings table"
    echo "   Check your database connection and credentials"
    exit 1
fi
