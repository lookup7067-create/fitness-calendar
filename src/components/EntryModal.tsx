"use client";
import React, { useState } from 'react';
import styles from './EntryModal.module.css';
import { DailyLog, BodyMetrics } from '@/lib/types';

interface Props {
    date: string;
    initialData?: DailyLog;
    onClose: () => void;
    onSave: (log: DailyLog) => void;
}

// 운동 카테고리 및 추천 상세 항목 정의
const WORKOUT_CATEGORIES: Record<string, string[]> = {
    '헬스': ['스쿼트', '벤치프레스', '데드리프트', '숄더프레스', '레그컬', '랫풀다운', '런지'],
    '유산소': ['러닝머신', '야외러닝', '사이클', '천국의계단', '인터벌', '줄넘기'],
    '맨몸운동': ['푸쉬업', '풀업', '매달리기', '플랭크', '윗몸일으키기', '버피'],
    '요가/필라테스': ['매트요가', '기구필라테스', '폼롤러', '스트레칭'],
    '구기종목': ['축구', '농구', '배드민턴', '테니스', '골프'],
    '기타': []
};

export default function EntryModal({ date, initialData, onClose, onSave }: Props) {
    // Metrics state
    const [weight, setWeight] = useState(initialData?.metrics?.weight?.toString() || '');
    const [muscle, setMuscle] = useState(initialData?.metrics?.muscleMass?.toString() || '');
    const [fat, setFat] = useState(initialData?.metrics?.bodyFatPercent?.toString() || '');

    // Day Status State
    const [dayStatus, setDayStatus] = useState<'workout' | 'rest' | 'travel' | 'sick'>(
        initialData?.dayStatus || (initialData?.exercises && Object.keys(initialData.exercises).length > 0 ? 'workout' : 'workout')
    );

    // Time state
    const [startTime, setStartTime] = useState(initialData?.startTime || '');
    const [endTime, setEndTime] = useState(initialData?.endTime || '');

    // Exercises state: Record<Category, Items[]>
    const [exercises, setExercises] = useState<Record<string, string[]>>(initialData?.exercises || {});
    // State for custom inputs per category
    const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

    const toggleCategory = (category: string) => {
        setExercises(prev => {
            const next = { ...prev };
            if (next[category]) {
                delete next[category]; // Remove category
            } else {
                next[category] = []; // Add category empty
            }
            return next;
        });
    };

    const toggleDetail = (category: string, item: string) => {
        setExercises(prev => {
            const currentItems = prev[category] || [];
            const newItems = currentItems.includes(item)
                ? currentItems.filter(i => i !== item)
                : [...currentItems, item];
            return { ...prev, [category]: newItems };
        });
    };

    const addCustomItem = (category: string) => {
        const val = customInputs[category]?.trim();
        if (!val) return;

        toggleDetail(category, val);
        setCustomInputs(prev => ({ ...prev, [category]: '' }));
    };

    const handleSave = () => {
        const metrics: BodyMetrics | undefined = (weight || muscle || fat) ? {
            weight: parseFloat(weight) || 0,
            muscleMass: parseFloat(muscle) || 0,
            bodyFatPercent: parseFloat(fat) || 0
        } : undefined;

        onSave({
            date,
            metrics,
            startTime,
            endTime,
            exercises: dayStatus === 'workout' ? exercises : {}, // Clear exercises if not workout
            dayStatus
        });
    };

    return (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.dateTitle}>{date}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.scrollArea}>

                    {/* Day Status Selection */}
                    <div className={styles.section} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                            <button
                                className={`${styles.pill} ${dayStatus === 'workout' ? styles.activePill : ''}`}
                                style={{ justifyContent: 'center', textAlign: 'center', padding: '0.6rem' }}
                                onClick={() => setDayStatus('workout')}
                            >
                                💪 운동
                            </button>
                            <button
                                className={`${styles.pill} ${dayStatus === 'rest' ? styles.activePill : ''}`}
                                style={{ justifyContent: 'center', textAlign: 'center', padding: '0.6rem' }}
                                onClick={() => setDayStatus('rest')}
                            >
                                💤 휴식
                            </button>
                            <button
                                className={`${styles.pill} ${dayStatus === 'travel' ? styles.activePill : ''}`}
                                style={{ justifyContent: 'center', textAlign: 'center', padding: '0.6rem' }}
                                onClick={() => setDayStatus('travel')}
                            >
                                ✈️ 여행
                            </button>
                            <button
                                className={`${styles.pill} ${dayStatus === 'sick' ? styles.activePill : ''}`}
                                style={{ justifyContent: 'center', textAlign: 'center', padding: '0.6rem' }}
                                onClick={() => setDayStatus('sick')}
                            >
                                🤒 아픔
                            </button>
                        </div>
                    </div>

                    {dayStatus === 'workout' && (
                        <>
                            {/* 1. 운동 카테고리 선택 */}
                            <div className={styles.section}>
                                <div className={styles.sectionTitle}>🔥 운동 종목 선택</div>
                                <div className={styles.pillContainer}>
                                    {Object.keys(WORKOUT_CATEGORIES).map(cat => (
                                        <button
                                            key={cat}
                                            className={`${styles.pill} ${exercises[cat] ? styles.activePill : ''}`}
                                            onClick={() => toggleCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 1.5. 시간 기록 (New) */}
                            <div className={styles.section}>
                                <div className={styles.sectionTitle}>⏰ 운동 시간</div>
                                <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <div className={styles.field}>
                                        <label>시작 시간</label>
                                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                    </div>
                                    <div className={styles.field}>
                                        <label>종료 시간</label>
                                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* 2. 상세 운동 기록 (동적 렌더링) */}
                            {Object.keys(exercises).length > 0 && (
                                <div className={styles.section}>
                                    <div className={styles.sectionTitle}>📝 상세 기록</div>
                                    {Object.keys(exercises).map(cat => (
                                        <div key={cat} className={styles.detailCard}>
                                            <div className={styles.detailHeader}>{cat}</div>

                                            {/* 추천 상세 항목 Chips */}
                                            <div className={styles.subPillContainer}>
                                                {WORKOUT_CATEGORIES[cat].map(item => (
                                                    <button
                                                        key={item}
                                                        className={`${styles.subPill} ${exercises[cat].includes(item) ? styles.activeSubPill : ''}`}
                                                        onClick={() => toggleDetail(cat, item)}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* 직접 입력 인풋 */}
                                            <div className={styles.inputGroup}>
                                                <input
                                                    type="text"
                                                    className={styles.miniInput}
                                                    placeholder={`기타 ${cat} 종목 추가...`}
                                                    value={customInputs[cat] || ''}
                                                    onChange={(e) => setCustomInputs(prev => ({ ...prev, [cat]: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') addCustomItem(cat);
                                                    }}
                                                />
                                                <button className={styles.addBtn} onClick={() => addCustomItem(cat)}>+</button>
                                            </div>

                                            {/* 선택된 항목들 요약 보여주기 */}
                                            {exercises[cat].length > 0 && (
                                                <div className={styles.selectedSummary}>
                                                    {exercises[cat].map(item => (
                                                        <span key={item} className={styles.summaryTag}>#{item}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* 3. 신체 기록 */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>⚖️ 신체 변화</div>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label>체중 (kg)</label>
                                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.0" />
                            </div>
                            <div className={styles.field}>
                                <label>골격근량 (kg)</label>
                                <input type="number" value={muscle} onChange={e => setMuscle(e.target.value)} placeholder="0.0" />
                            </div>
                            <div className={styles.field}>
                                <label>체지방률 (%)</label>
                                <input type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="0.0" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>취소</button>
                    <button className={styles.saveBtn} onClick={handleSave}>모두 저장</button>
                </div>
            </div>
        </div>
    );
}
