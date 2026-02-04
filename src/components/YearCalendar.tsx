"use client";
import React from 'react';
import styles from './YearCalendar.module.css';
import { CalendarData } from '@/lib/types';

const MONTHS = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
];
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
    year: number;
    data: CalendarData;
    onDateClick: (date: string) => void;
}

export default function YearCalendar({ year, data, onDateClick }: Props) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const renderMonth = (monthIndex: number) => {
        const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        const days = [];
        // Empty cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`pad-${i}`} className={styles.dayCell} style={{ cursor: 'default', background: 'transparent', border: 'none' }} />);
        }

        // Days extraction
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const log = data[dateStr];
            const hasData = !!log;
            const dayStatus = log?.dayStatus || (log ? 'workout' : undefined);
            const isToday = todayStr === dateStr;

            let tooltip = dateStr;
            let displayElement = null;

            if (log) {
                if (dayStatus === 'rest') {
                    tooltip += `\n💤 휴식`;
                    displayElement = <span style={{ fontSize: '1.2rem', marginTop: '4px' }}>💤</span>;
                } else if (dayStatus === 'travel') {
                    tooltip += `\n✈️ 여행`;
                    displayElement = <span style={{ fontSize: '1.2rem', marginTop: '4px' }}>✈️</span>;
                } else if (dayStatus === 'sick') {
                    tooltip += `\n🤒 아픔/몸살`;
                    displayElement = <span style={{ fontSize: '1.2rem', marginTop: '4px' }}>🤒</span>;
                } else {
                    // Workout
                    let startTimeDisplay = log.startTime;
                    let endTimeDisplay = log.endTime;

                    if (log.startTime || log.endTime) {
                        const start = log.startTime || '??:??';
                        const end = log.endTime || '??:??';
                        tooltip += `\n⏰ ${start} ~ ${end}`;
                    }
                    if (log.exercises && Object.keys(log.exercises).length > 0) {
                        const cats = Object.keys(log.exercises).join(', ');
                        tooltip += `\n💪 ${cats}`;
                    }

                    displayElement = (
                        <div className={styles.timeGroup}>
                            {startTimeDisplay && (
                                <span className={styles.timeLabel}>{startTimeDisplay}~</span>
                            )}
                            {endTimeDisplay && (
                                <span className={styles.timeLabel}>{endTimeDisplay}</span>
                            )}
                        </div>
                    );
                }
            }

            days.push(
                <div
                    key={d}
                    className={`${styles.dayCell} ${hasData ? styles.hasData : ''} ${isToday ? styles.currentDay : ''}`}
                    onClick={() => onDateClick(dateStr)}
                    title={tooltip}
                >
                    <span className={styles.dayNumber}>{d}</span>
                    {displayElement}
                </div>
            );
        }

        return days;
    };

    return (
        <div className={styles.calendarContainer}>
            {MONTHS.map((monthName, idx) => (
                <div key={monthName} className={styles.monthCard} id={`month-${idx}`}>
                    <div className={styles.monthTitle}>{monthName}</div>
                    <div className={styles.daysGrid}>
                        {DAYS.map(day => <div key={day} className={styles.dayLabel}>{day}</div>)}
                        {renderMonth(idx)}
                    </div>
                </div>
            ))}
        </div>
    );
}
