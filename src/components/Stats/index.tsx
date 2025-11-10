import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import TableStats from '../TableStats';
import ChartStats from '../ChartStats';
import { useTranslation } from 'react-i18next';
import './style.css';

import { genStats } from '@/data/dummyStats'
import {Like, Comment} from '@/data/datatypes'

export interface StatsData {
    likes: { month: string; count: number }[];
    comments: { month: string; count: number }[];
}

const Stats = () => {
    const { theme } = useContext(ThemeContext);
    const {token} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
    const [stats, setStats] = useState<StatsData | null>(null);
    const [location, setLocation] = useState<"profile" | "stats">("stats");
    const router = useRouter();
    const { t } = useTranslation();

    const handleToggle = () => {
        setActiveTab(prev => (prev === 'table' ? 'chart' : 'table'));
    };

    function transformData(data: Like[] | Comment[]): { month: string; count: number }[] {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const result: { month: string; count: number }[] = [];
        const monthCounts: { [key: string]: number } = {};

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const date = new Date(item.creationDate);
            const monthIndex = date.getMonth();
            const monthName = monthNames[monthIndex];

            if (monthCounts[monthName] === undefined) {
                monthCounts[monthName] = 1;
            } else {
                monthCounts[monthName] += 1;
            }
        }

        for (let i = 0; i < monthNames.length; i++) {
            const name = monthNames[i];
            if (monthCounts[name] !== undefined) {
                result.push({
                    month: name,
                    count: monthCounts[name]
                });
            }
        }

        return result;
    }

    useEffect(() => {
        if (token) {
            const fetchStats = async () => {
                try {
                    const [likesRes, commentsRes] = await Promise.all([
                        fetch(`/api/me/likes`, { headers: { Authorization: `Bearer ${token}`} }),
                        fetch(`/api/me/comments`, { headers: { Authorization: `Bearer ${token}`} }),
                    ]);

                    if (!likesRes.ok || !commentsRes.ok) throw new Error('Fetch failed');

                    const likesData = await likesRes.json();
                    const commentsData = await commentsRes.json();

                    setStats({
                        likes: transformData(likesData),
                        comments: transformData(commentsData),
                    });
                } catch (err) {
                    console.error(err);
                }
            };

            fetchStats();
        }
        
    }, [token]);


    return (
        <>
            <div className="page-switch">
                <button className={location === "profile" ? "active" : ""} onClick={() => {router.push('/profile'); setLocation("profile")}}>{t('profileLink')}</button>
                <button className={location === "stats" ? "active" : ""} onClick={() => {router.push('/stats');setLocation("stats")}}>{t('statsLink')}</button>
            </div>
            <div className="general-stats" data-theme={theme}>
                {genStats.map((stat, index) => (
                    <div className="stat" key={index}>
                        <p>{stat.title}</p>
                        <h1>{stat.stat}</h1>
                        <small>{stat.percent >= 0 ? `+${stat.percent}` : `${stat.percent}`}{t('percentStats')}</small>
                    </div>
                ))}
            </div>
            <div className="stats" data-theme={theme}>
                <div className="view">
                    <p>{t('tableView')}</p>
                    <label className="tabSwitch">
                        <input
                            type="checkbox"
                            checked={activeTab === 'chart'}
                            onChange={handleToggle}
                        />
                        <span className="slider" />
                    </label>
                    <p>{t('chartView')}</p>
                </div>

                {activeTab === 'table' && stats && <TableStats stats={stats} />}
                {activeTab === 'chart' && stats && <ChartStats stats={stats} />}
            </div>
        </>
    );
};

export default Stats;