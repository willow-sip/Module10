import React, { Component } from 'react';
import Comment from '../Comment';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

class Post extends Component {
    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
            showComments: false
        };
    }

    toggleShowComments = () => {
        this.setState(prevState => ({
            showComments: !prevState.showComments
        }));
    };

    calculatePublishTime = () => {
        const now = new Date();
        const published = new Date(this.props.post.publishTime);
        const diffMs = now - published;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (seconds < 60) return rtf.format(-seconds, 'second');
        if (minutes < 60) return rtf.format(-minutes, 'minute');
        if (hours < 24) return rtf.format(-hours, 'hour');
        if (days < 7) return rtf.format(-days, 'day');
        if (days < 30) return rtf.format(-Math.floor(days / 7), 'week');
        if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
        return rtf.format(-Math.floor(days / 365), 'year');
    };

    render() {
        const { post } = this.props;
        const { showComments } = this.state;
        const theme = this.context;

        return (
            <AuthContext.Consumer>
                {({ userAuth }) => (
                    <div className="post" data-theme={theme}>
                        <div className="author">
                            <img
                                src={post.author.avatar || './imgs/default-avatar.jpg'}
                                alt="Post author avatar"
                                className="avatar"
                            />
                            <div className="authorInfo">
                                <p>{post.author.name}</p>
                                <small>{this.calculatePublishTime()}</small>
                            </div>
                        </div>

                        {post.image && <img src={post.image} alt="Post" />}
                        <h3>{post.caption}</h3>

                        <div className="postButtons">
                            <div className="likes">
                                <i className="bi bi-suit-heart" /> {post.likes} likes
                            </div>
                            <div className="comments">
                                <i className="bi bi-chat-left" />
                                <span className="comment-text">
                                    {userAuth
                                        ? `${post.comments.length} comments`
                                        : 'You have to log in to see the comments'}
                                </span>
                            </div>
                            {userAuth && (
                                <button onClick={this.toggleShowComments}>
                                    {showComments
                                        ? <i className="bi bi-chevron-down" />
                                        : <i className="bi bi-chevron-up" />}
                                </button>
                            )}
                        </div>

                        {showComments && (
                            <div className="commentSection">
                                {post.comments.map((comment, index) => (
                                    <Comment key={index} comment={comment} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default Post;
