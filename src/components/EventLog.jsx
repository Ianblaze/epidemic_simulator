import React, { useRef, useEffect } from 'react';

export default function EventLog({ eventLog }) {
  const logRef = useRef(null);
  const logs = eventLog || [];

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [logs]);

  if (!logs.length) {
    return (
      <div className="chart-empty" style={{ height: '280px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', borderRadius: '6px' }}>
        <div style={{ color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '8px' }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Awaiting Global News Feed...
        </div>
      </div>
    );
  }

  const getTag = (type) => {
    switch (type) {
      case 'alert': return <span className="news-tag alert-tag">URGENT</span>;
      case 'warning': return <span className="news-tag warning-tag">UPDATE</span>;
      default: return <span className="news-tag info-tag">NEWS</span>;
    }
  };

  return (
    <div className="news-feed-container" ref={logRef}>
      {logs.slice().reverse().map((entry, i) => (
        <div key={i} className={`news-item news-item--${entry.type}`}>
          <div className="news-item-header">
            {getTag(entry.type)}
            <span className="news-day">Day {entry.day}</span>
          </div>
          <div className="news-message">{entry.message}</div>
        </div>
      ))}
      <style>{`
        .news-feed-container {
          height: 300px;
          overflow-y: auto;
          background: #0B0D12;
          border: 1px solid #1f2937;
          border-radius: 8px;
          padding: 0.5rem;
        }
        .news-feed-container::-webkit-scrollbar {
          width: 6px;
        }
        .news-feed-container::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .news-item {
          padding: 0.8rem;
          margin-bottom: 0.5rem;
          border-radius: 6px;
          background: #111827;
          border-left: 3px solid #374151;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .news-item--alert { border-left-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .news-item--warning { border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
        .news-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }
        .news-tag {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 3px;
          letter-spacing: 0.5px;
        }
        .alert-tag { background: #ef4444; color: #fff; }
        .warning-tag { background: #f59e0b; color: #000; }
        .info-tag { background: #3b82f6; color: #fff; }
        .news-day {
          font-size: 0.75rem;
          color: #9ca3af;
          font-family: monospace;
        }
        .news-message {
          font-size: 0.9rem;
          line-height: 1.4;
          color: #f3f4f6;
        }
      `}</style>
    </div>
  );
}
