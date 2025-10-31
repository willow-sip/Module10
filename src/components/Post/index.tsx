import React, { Component } from 'react';
import Comment from '../Comment';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './style.css';

import { Post as PostType, User, Comment as CommentType } from '../../data/datatypes'

interface PostProps {
    post: PostType;
}

interface PostState {
    showComments: boolean;
    comments: CommentType[] | undefined;
    author: User ;
}

class Post extends Component<PostProps, PostState> {
    static contextType = ThemeContext;
    context!: React.ContextType<typeof ThemeContext>;

    constructor(props: PostProps) {
        super(props);
        this.state = {
            showComments: false,
            comments: undefined,
            author: {
                id: NaN,
                username: '',
            },
        };
    }

    toggleShowComments = () => {
        this.setState(prevState => ({
            showComments: !prevState.showComments
        }));
    };

    calculatePublishTime = (): string => {
        const now = new Date();
        const published = new Date(this.props.post.creationDate);;
        const diffMs = now.getTime() - published.getTime();

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



    componentDidMount(): void {
        const id: number = this.props.post.id;
        fetch(`http://localhost:3000/api/posts/${id}/comments`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.setState(() => ({
                    comments: data,
                }));
            })
            .catch(error => {
                console.error(error);
            });

        fetch(`http://localhost:3000/api/posts/${id}/author`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // this.setState(() => ({
                //     author: data,
                // }));
                //FAKE TEMPORARY REQUEST
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        const { showComments } = this.state;
        const theme = this.context;
        const { title, content, image, likesCount, commentsCount } = this.props.post;
        const comments = this.state.comments;
        const { profileImage, firstName, secondName } = this.state.author;

        return (
            <AuthContext.Consumer>
                {({ userAuth }) => (
                    <div className="post" data-theme={theme}>
                        <div className="author">
                            <img
                                src={profileImage || './imgs/default-avatar.jpg'}
                                alt="Post author avatar"
                                className="avatar"
                            />
                            <div className="authorInfo">
                                <p>{firstName} {secondName}</p>
                                <small>{this.calculatePublishTime()}</small>
                            </div>
                        </div>

                        {image && <img src={image} alt="Post" />}
                        <h3>{title}</h3>
                        <p>{content}</p>

                        <div className="postButtons">
                            <div className="likes">
                                <i className="bi bi-suit-heart" /> {likesCount} likes
                            </div>
                            <div className="comments">
                                <i className="bi bi-chat-left" />
                                <span className="comment-text">
                                    {userAuth
                                        ? `${commentsCount} comments`
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
                                {comments?.map((comment, i) => (
                                    <Comment key={comment.id} authorId={comment.authorId} text={comment.text} />
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
