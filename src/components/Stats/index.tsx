import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import TableStats from '../TableStats/TableStats';
import ChartStats from '../ChartStats/ChartStats';
import './style.css';

import { statsData, genStats } from '../../data/dummyStats'

export interface StatsData {
    likes: { month: string; count: number }[];
    comments: { month: string; count: number }[];
}

const Stats = () => {
    const { theme } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
    const [stats, setStats] = useState<StatsData>(statsData);
    const [location, setLocation] = useState<"profile" | "stats">("stats");
    const navigate = useNavigate();

    const handleToggle = () => {
        setActiveTab(prev => (prev === 'table' ? 'chart' : 'table'));
    };

    // useEffect(() => {
    //     if (token) {
    //         fetch(`http://localhost:3000/api/statistics`, {
    //             headers: {
    //                 Authorization: `${token}`,
    //             },
    //         })
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error(`HTTP error! status: ${response.status}`);
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 //setStats(data);
    //                 //FAKE TEMPORARY REQUEST
    //             })
    //             .catch(error => {
    //                 console.error(error);
    //             });
    //     }
    // }, [token]);

    return (
        <>
            <div className="page-switch">
                <button className={location === "profile" ? "active" : ""} onClick={() => {navigate('/profile'); setLocation("profile")}}>Profile Info</button>
                <button className={location === "stats" ? "active" : ""} onClick={() => {navigate('/stats');setLocation("stats")}}>Statistics</button>
            </div>
            <div className="general-stats" data-theme={theme}>
                {genStats.map((stat, index) => (
                    <div className="stat" key={index}>
                        <p>{stat.title}</p>
                        <h1>{stat.stat}</h1>
                        <small>{stat.percent >= 0 ? `+${stat.percent}` : `${stat.percent}`}% month over month</small>
                    </div>
                ))}
            </div>
            <div className="stats" data-theme={theme}>
                <div className="view">
                    <p>Table view</p>
                    <label className="tabSwitch">
                        <input
                            type="checkbox"
                            checked={activeTab === 'chart'}
                            onChange={handleToggle}
                        />
                        <span className="slider" />
                    </label>
                    <p>Chart view</p>
                </div>

                {activeTab === 'table' && stats && <TableStats stats={stats} />}
                {activeTab === 'chart' && stats && <ChartStats stats={stats} />}
            </div>
        </>
    );
};

export default Stats;