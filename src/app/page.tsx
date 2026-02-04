"use client";
import { useState, useEffect } from 'react';
import YearCalendar from '@/components/YearCalendar';
import EntryModal from '@/components/EntryModal';
import StatsView from '@/components/StatsView';
import { CalendarData, DailyLog } from '@/lib/types';
import { getCalendarData, saveDailyLog } from '@/lib/storage';

export default function Home() {
  const [data, setData] = useState<CalendarData>({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');

  useEffect(() => {
    setData(getCalendarData());
  }, []);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleSave = (log: DailyLog) => {
    const newData = saveDailyLog(log);
    setData(newData);
    setSelectedDate(null);
  };

  return (
    <main className="container">
      <header style={{
        marginBottom: '2rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '0.5rem',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          <span style={{ color: 'var(--primary)' }}>Fit</span>Cal
        </h1>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`btn ${activeTab !== 'calendar' ? 'inactive' : ''}`}
            style={{
              background: activeTab === 'calendar' ? 'var(--primary)' : 'transparent',
              border: '1px solid var(--primary)',
              color: activeTab === 'calendar' ? 'white' : 'var(--text-muted)',
              padding: '0.6rem 1.2rem',
              fontSize: '0.8rem'
            }}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`btn ${activeTab !== 'stats' ? 'inactive' : ''}`}
            style={{
              background: activeTab === 'stats' ? 'var(--primary)' : 'transparent',
              border: '1px solid var(--primary)',
              color: activeTab === 'stats' ? 'white' : 'var(--text-muted)',
              padding: '0.6rem 1.2rem',
              fontSize: '0.8rem'
            }}
          >
            Stats
          </button>
        </div>

        {activeTab === 'calendar' && (
          <div style={{
            display: 'inline-flex',
            gap: '1rem',
            alignItems: 'center',
            marginTop: '0.5rem',
            background: '#18181B',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            border: '1px solid #27272A'
          }}>
            <button
              onClick={() => setYear(y => y - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem' }}
            >
              ‹
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 500, minWidth: '60px', color: 'white' }}>{year}</span>
            <button
              onClick={() => setYear(y => y + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem' }}
            >
              ›
            </button>
          </div>
        )}
      </header>

      {activeTab === 'calendar' ? (
        <YearCalendar
          year={year}
          data={data}
          onDateClick={handleDateClick}
        />
      ) : (
        <StatsView data={data} year={year} />
      )}

      {selectedDate && (
        <EntryModal
          date={selectedDate}
          initialData={data[selectedDate]}
          onClose={() => setSelectedDate(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
