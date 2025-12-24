import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';

interface CallRecording {
  id: number;
  call_control_id: string;
  from_number: string;
  to_number: string;
  direction: 'incoming' | 'outgoing';
  start_time: string;
  duration_seconds: number;
  status: string;
  hangup_cause: string;
  ai_assistant_used: boolean;
  ai_summary?: string;
  ai_sentiment?: string;
  ai_outcome?: string;
  recording_url?: string;
  recording_available: boolean;
  transcript?: string;
  transcript_available: boolean;
  caller_name?: string;
  lead_quality?: 'Hot' | 'Warm' | 'Cold' | 'Not Qualified';
  follow_up_required: boolean;
  appointment_booked: boolean;
}

interface CallHistoryFilters {
  direction?: 'incoming' | 'outgoing' | 'all';
  leadQuality?: string;
  dateRange?: string;
  hasRecording?: boolean;
  hasTranscript?: boolean;
}

const CallHistorySection: React.FC = () => {
  const [calls, setCalls] = useState<CallRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallRecording | null>(null);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CallHistoryFilters>({ direction: 'all' });
  const [showTranscript, setShowTranscript] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadCallHistory();
  }, [filters]);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.direction && filters.direction !== 'all') {
        queryParams.append('direction', filters.direction);
      }
      if (filters.leadQuality) {
        queryParams.append('leadQuality', filters.leadQuality);
      }
      if (filters.hasRecording) {
        queryParams.append('hasRecording', 'true');
      }
      if (filters.hasTranscript) {
        queryParams.append('hasTranscript', 'true');
      }

      const response = await fetch(`/api/calls/history?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error('Error loading call history:', error);
      alert('Failed to load call history. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const syncFromTelnyx = async () => {
    try {
      setLoading(true);
      
      // Fetch both calls and recordings from Telnyx
      const [callsResponse, recordingsResponse] = await Promise.all([
        fetch('/api/telnyx/calls'),
        fetch('/api/telnyx/recordings')
      ]);

      if (!callsResponse.ok || !recordingsResponse.ok) {
        throw new Error('Failed to sync from Telnyx');
      }

      const callsData = await callsResponse.json();
      const recordingsData = await recordingsResponse.json();
      
      alert(`Synced ${callsData.data?.length || 0} calls and ${recordingsData.data?.length || 0} recordings from Telnyx!`);
      
      // Reload call history
      await loadCallHistory();
    } catch (error) {
      console.error('Error syncing from Telnyx:', error);
      alert('Failed to sync from Telnyx. Make sure your API key is configured correctly.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayRecording = (call: CallRecording) => {
    if (!call.recording_url) return;

    if (playingCallId === call.call_control_id) {
      // Pause
      audioRef.current?.pause();
      setPlayingCallId(null);
    } else {
      // Play new recording
      if (audioRef.current) {
        audioRef.current.src = call.recording_url;
        audioRef.current.play();
        setPlayingCallId(call.call_control_id);
      }
    }
  };

  const handleDownloadRecording = async (call: CallRecording) => {
    if (!call.recording_url) return;

    try {
      const response = await fetch(call.recording_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call-${call.from_number}-${new Date(call.start_time).toISOString()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading recording:', error);
      alert('Failed to download recording');
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getLeadQualityColor = (quality?: string) => {
    switch (quality) {
      case 'Hot':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Warm':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Cold':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Not Qualified':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <Icons.ThumbsUp size={14} className="text-emerald-500" />;
      case 'negative':
        return <Icons.AlertTriangle size={14} className="text-red-500" />;
      case 'neutral':
        return <Icons.Minus size={14} className="text-gray-400" />;
      default:
        return <Icons.Minus size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Call History & Recordings</h2>
          <p className="text-gray-500 mt-1">
            Complete call history from your Telnyx AI Assistant with recordings and transcripts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={syncFromTelnyx}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Icons.Download size={16} className={loading ? 'animate-spin' : ''} />
            Sync from Telnyx
          </button>
          <button
            onClick={loadCallHistory}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Icons.RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Direction</label>
            <select
              value={filters.direction || 'all'}
              onChange={(e) => setFilters({ ...filters, direction: e.target.value as any })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Calls</option>
              <option value="incoming">Inbound Only</option>
              <option value="outgoing">Outbound Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Lead Quality</label>
            <select
              value={filters.leadQuality || ''}
              onChange={(e) => setFilters({ ...filters, leadQuality: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Qualities</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
              <option value="Not Qualified">Not Qualified</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasRecording || false}
                onChange={(e) => setFilters({ ...filters, hasRecording: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-gray-500">Has Recording</span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasTranscript || false}
                onChange={(e) => setFilters({ ...filters, hasTranscript: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-gray-500">Has Transcript</span>
            </label>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ direction: 'all' })}
              className="w-full px-3 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icons.Phone size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{calls.length}</p>
              <p className="text-xs text-gray-500">Total Calls</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Icons.Mic size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {calls.filter(c => c.recording_available).length}
              </p>
              <p className="text-xs text-gray-500">Recordings</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icons.FileText size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {calls.filter(c => c.transcript_available).length}
              </p>
              <p className="text-xs text-gray-500">Transcripts</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Icons.Calendar size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {calls.filter(c => c.appointment_booked).length}
              </p>
              <p className="text-xs text-gray-500">Booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icons.Loader size={32} className="text-accent animate-spin" />
          </div>
        ) : calls.length === 0 ? (
          <div className="text-center py-12">
            <Icons.Phone size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-500 mb-2">No call history found</p>
            <p className="text-sm text-gray-400 mb-4">
              Calls from your Telnyx AI Assistant will appear here automatically via webhooks
            </p>
            <button
              onClick={syncFromTelnyx}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-lg font-medium transition-colors"
            >
              <Icons.Download size={16} />
              Sync Call History from Telnyx
            </button>
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto text-left">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icons.Info size={16} className="text-blue-500" />
                Setup Required
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li>Configure webhook URL in Telnyx Portal</li>
                <li>Enable call recording in your Telnyx application</li>
                <li>Set up AI Assistant for transcription</li>
                <li>Make a test call to verify integration</li>
              </ul>
              <a
                href="/CALL_HISTORY_GUIDE.md"
                target="_blank"
                className="text-accent hover:underline text-sm mt-2 inline-block"
              >
                View Setup Guide →
              </a>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {calls.map((call) => (
              <div key={call.id} className="p-4 hover:bg-foreground/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  {/* Call Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        call.direction === 'incoming' ? 'bg-blue-500/10' : 'bg-purple-500/10'
                      }`}>
                        {call.direction === 'incoming' ? (
                          <Icons.PhoneIncoming size={16} className="text-blue-500" />
                        ) : (
                          <Icons.PhoneOutgoing size={16} className="text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {call.caller_name || formatPhoneNumber(call.from_number)}
                          </h3>
                          {call.ai_assistant_used && (
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                              AI
                            </span>
                          )}
                          {call.appointment_booked && (
                            <Icons.CheckCircle size={14} className="text-emerald-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatPhoneNumber(call.from_number)} → {formatPhoneNumber(call.to_number)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Icons.Clock size={12} />
                        {formatDuration(call.duration_seconds)}
                      </span>
                      <span>
                        {new Date(call.start_time).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                      </span>
                      {call.lead_quality && (
                        <span className={`px-2 py-0.5 rounded border ${getLeadQualityColor(call.lead_quality)}`}>
                          {call.lead_quality}
                        </span>
                      )}
                      {call.ai_sentiment && (
                        <span className="flex items-center gap-1">
                          {getSentimentIcon(call.ai_sentiment)}
                          {call.ai_sentiment}
                        </span>
                      )}
                    </div>

                    {call.ai_summary && (
                      <div className="bg-foreground/5 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Icons.Sparkles size={14} className="text-accent mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">{call.ai_summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {call.recording_available && call.recording_url && (
                        <>
                          <button
                            onClick={() => handlePlayRecording(call)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-xs font-medium transition-colors"
                          >
                            {playingCallId === call.call_control_id ? (
                              <>
                                <Icons.Pause size={12} />
                                Pause
                              </>
                            ) : (
                              <>
                                <Icons.Play size={12} />
                                Play Recording
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDownloadRecording(call)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg text-xs font-medium transition-colors"
                          >
                            <Icons.Download size={12} />
                            Download
                          </button>
                        </>
                      )}

                      {call.transcript_available && call.transcript && (
                        <button
                          onClick={() => setShowTranscript(
                            showTranscript === call.call_control_id ? null : call.call_control_id
                          )}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-lg text-xs font-medium transition-colors"
                        >
                          <Icons.FileText size={12} />
                          {showTranscript === call.call_control_id ? 'Hide' : 'View'} Transcript
                        </button>
                      )}

                      {call.follow_up_required && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-lg text-xs font-medium">
                          <Icons.AlertCircle size={12} />
                          Follow-up Required
                        </span>
                      )}
                    </div>

                    {/* Transcript Display */}
                    {showTranscript === call.call_control_id && call.transcript && (
                      <div className="mt-3 bg-background border border-border rounded-lg p-4 animate-in fade-in duration-300">
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Icons.FileText size={14} />
                          Call Transcript
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {call.transcript}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingCallId(null)}
        onError={() => {
          setPlayingCallId(null);
          alert('Failed to play recording');
        }}
      />
    </div>
  );
};

export default CallHistorySection;
