'use client';

import { useTranslation } from 'react-i18next';
import { StatsData } from '../Stats';
import './style.css';

interface Props {
    stats: StatsData;
}

const TableStats = ({ stats }: Props) => {
    const { t } = useTranslation();
    return (
        <div className="statsTable">
            <div className="stat">
                <h3>{t('likesStat')}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>{t('month')}</th>
                            <th>{t('likesCountStats')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.likes.map((like, i) => (
                            <tr key={i}>
                                <td>{like.month}</td>
                                <td>{like.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="stat">
                <h3>{t('commentsStat')}</h3>
                <table>
                    <thead><tr><th>{t('month')}</th><th>{t('commentsCountStats')}</th></tr></thead>
                    <tbody>
                        {stats.comments.map((comment, i) => (
                            <tr key={i}><td>{comment.month}</td><td>{comment.count}</td></tr>
                        ))}
                    </tbody>
                </table></div>


        </div>

    );
}

export default TableStats;