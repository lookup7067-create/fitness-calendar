"use client";
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CalendarData } from '@/lib/types';
import styles from './YearCalendar.module.css';

interface Props {
    data: CalendarData;
    year: number;
}

export default function UnstatsView({ data, year }: Props) {
    // Transform data for charts
    const chartData = useMemo(() => {
        const sortedDates = Object.keys(data).sort();
        const yearDates = sortedDates.filter(d => d.startsWith(String(year)));

        return yearDates.map(date => {
            const log = data[date];
            return {
                date: date.substring(5), // MM-DD
                weight: log.metrics?.weight || null,
                muscle: log.metrics?.muscleMass || null,
                fat: log.metrics?.bodyFatPercent || null,
            };
        }).filter(item => item.weight || item.muscle || item.fat);
    }, [data, year]);

    if (chartData.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>아직 기록된 데이터가 없습니다.</p>
                <small>매일의 변화를 기록해보세요!</small>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Weight Chart */}
            <div className={styles.monthCard} style={{ minHeight: '300px' }}>
                <div className={styles.monthTitle} style={{ fontSize: '1rem', textAlign: 'left', marginBottom: '1rem' }}>
                    Weight History (kg)
                </div>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} tickMargin={10} minTickGap={30} />
                            <YAxis stroke="#666" domain={['dataMin - 1', 'dataMax + 1']} hide={true} />
                            <Tooltip
                                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#3B82F6' }}
                            />
                            <Area type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" dot={{ r: 4, fill: '#111', stroke: '#3B82F6', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Muscle Chart */}
            <div className={styles.monthCard} style={{ minHeight: '300px' }}>
                <div className={styles.monthTitle} style={{ fontSize: '1rem', textAlign: 'left', marginBottom: '1rem' }}>
                    Muscle Mass (kg)
                </div>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorMuscle" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} tickMargin={10} minTickGap={30} />
                            <YAxis stroke="#666" domain={['dataMin - 0.5', 'dataMax + 0.5']} hide={true} />
                            <Tooltip
                                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#10B981' }}
                            />
                            <Area type="monotone" dataKey="muscle" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorMuscle)" dot={{ r: 4, fill: '#111', stroke: '#10B981', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Body Fat Chart (NEW) */}
            <div className={styles.monthCard} style={{ minHeight: '300px' }}>
                <div className={styles.monthTitle} style={{ fontSize: '1rem', textAlign: 'left', marginBottom: '1rem' }}>
                    Body Fat (%)
                </div>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} tickMargin={10} minTickGap={30} />
                            <YAxis stroke="#666" domain={['dataMin - 0.5', 'dataMax + 0.5']} hide={true} />
                            <Tooltip
                                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#8B5CF6' }}
                            />
                            <Area type="monotone" dataKey="fat" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorFat)" dot={{ r: 4, fill: '#111', stroke: '#8B5CF6', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Backup Section */}
            <div className={styles.monthCard}>
                <div className={styles.monthTitle} style={{ fontSize: '1.1rem', textAlign: 'left', marginBottom: '0.5rem' }}>
                    💾 데이터 관리 (Data Backup)
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    이 앱은 100% 무료이며 모든 데이터는 회원님의 기기에만 저장됩니다. <br />
                    데이터를 잃어버리지 않도록 주기적으로 백업 파일을 저장해주세요.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn"
                        style={{ flex: 1, backgroundColor: '#27272A', border: '1px solid #333' }}
                        onClick={() => {
                            const dataStr = JSON.stringify(data, null, 2);
                            const blob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `fitcal_backup_${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                        }}
                    >
                        📤 데이터 저장하기 (내보내기)
                    </button>
                    <button
                        className="btn"
                        style={{ flex: 1, backgroundColor: '#27272A', border: '1px solid #333' }}
                        onClick={() => document.getElementById('import-input')?.click()}
                    >
                        📥 데이터 불러오기
                    </button>
                    <input
                        id="import-input"
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                try {
                                    const json = JSON.parse(event.target?.result as string);
                                    localStorage.setItem('fitness_calendar_data', JSON.stringify(json));
                                    alert('데이터가 성공적으로 복구되었습니다! 새로고침합니다.');
                                    window.location.reload();
                                } catch (err) {
                                    alert('파일 형식이 올바르지 않습니다.');
                                }
                            };
                            reader.readAsText(file);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
