import { StatsData } from '../Stats';
import './style.css';

interface Props {
    stats: StatsData;
}

const TableStats = ({ stats }: Props) => {
    return (
        <div className="statsTable">
            <div className="stat">
                <h3>Likes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Likes count</th>
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
                <h3>Comments</h3>
                <table>
                    <thead><tr><th>Month</th><th>Comments count</th></tr></thead>
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