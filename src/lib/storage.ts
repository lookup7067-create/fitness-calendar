import { CalendarData, DailyLog } from './types';

const STORAGE_KEY = 'fitness_calendar_data';

export const getCalendarData = (): CalendarData => {
    if (typeof window === 'undefined') return {};
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Failed to load data', e);
        return {};
    }
};

export const saveDailyLog = (log: DailyLog): CalendarData => {
    const currentData = getCalendarData();
    const newData = {
        ...currentData,
        [log.date]: log
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
};

export const getLogByDate = (date: string): DailyLog | null => {
    const data = getCalendarData();
    return data[date] || null;
}
