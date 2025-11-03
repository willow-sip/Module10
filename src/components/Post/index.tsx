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
    author: User;
    liked: boolean;
    likesCount: number;
    newComment: string;
    prevToken: string | null;
}

class Post extends Component<PostProps, PostState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: PostProps) {
        super(props);
        this.state = {
            showComments: false,
            comments: undefined,
            author: {
                id: NaN,
                username: '',
            },
            liked: false,
            likesCount: props.post.likesCount,
            newComment: '',
            prevToken: null,
        };
    }

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

    toggleShowComments = () => {
        this.setState(prevState => ({
            showComments: !prevState.showComments
        }));
    };

    handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ newComment: e.target.value });
    };

    handleAddComment = () => {
        const { newComment, comments } = this.state;
        const { token, user } = this.context;
        const postId = this.props.post.id;

        if (!newComment.trim()) {
            console.log('Comment text is empty');
            return;
        }

        const commentData = {
            postId: Number(postId),
            text: newComment.trim(),
        };

        fetch('http://localhost:3000/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(commentData),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(createdComment => {
                if (user) {
                    const fullComment: CommentType = {
                        id: createdComment.id,
                        text: createdComment.text,
                        authorId: user.id,
                        postId: createdComment.postId,
                        creationDate: createdComment.creationDate || new Date().toISOString(),
                        modifiedDate: createdComment.modifiedDate || new Date().toISOString(),
                    };
                    this.setState(prevState => ({
                        comments: prevState.comments
                            ? [...prevState.comments, fullComment]
                            : [fullComment],
                        newComment: '',
                    }));
                }
            }).catch(err => console.error(err));
    };

    handleLike = () => {
        const { liked } = this.state;
        const { token } = this.context;
        const postId = this.props.post.id;

        const mutation = `
            mutation LikeToggle($postId: Int!) {
                ${liked ? 'dislikePost' : 'likePost'}(postId: $postId) {
                    id
                }
            }
        `;

        const variables = { postId };

        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query: mutation, variables }),
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const success = liked
                    ? !!data.data?.dislikePost?.id
                    : !!data.data?.likePost?.id;

                if (success) {
                    this.setState(prevState => ({
                        liked: !prevState.liked,
                        likesCount: prevState.liked
                            ? prevState.likesCount - 1
                            : prevState.likesCount + 1,
                    }));
                }
            })
            .catch(err => console.error(err));
    };

    loadCommentsAndAuthor = () => {
        const id: number = this.props.post.id;
        const { token, user } = this.context;

        if (user && token) {
            fetch(`http://localhost:3000/api/posts/${id}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
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

            fetch(`http://localhost:3000/api/posts/${id}/author`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
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
    }

    componentDidMount(): void {
        this.loadCommentsAndAuthor();
    }

    componentDidUpdate(prevProps: PostProps, prevState: PostState) {
        const { token } = this.context;
        const { prevToken } = this.state;

        if (!prevToken && token) {
            this.loadCommentsAndAuthor();
        }

        if (prevToken !== token) {
            this.setState({ prevToken: token });
        }
    }



    render() {
        const { showComments } = this.state;
        const { userAuth } = this.context;
        const { title, content, image } = this.props.post;
        const comments = this.state.comments;
        const commentsCount = this.state.comments?.length;
        const { profileImage, firstName, secondName } = this.state.author;

        return (
            <ThemeContext.Consumer>
                {theme => (
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
                                <i
                                    className={this.state.liked ? 'bi bi-suit-heart-fill' : 'bi bi-suit-heart'}
                                    onClick={this.handleLike}
                                />{this.state.likesCount} likes
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
                                {comments?.map(comment => (
                                    <Comment
                                        key={comment.id}
                                        id={comment.id}
                                        authorId={comment.authorId}
                                        text={comment.text}
                                        edit={(newText) => {
                                            this.setState(prev => ({
                                                comments: prev.comments?.map(prevCom =>
                                                    prevCom.id === comment.id ? { ...prevCom, text: newText } : prevCom),
                                            }));
                                        }}
                                        deleteComm={() => {
                                            this.setState(prev => ({
                                                comments: prev.comments?.filter(c => c.id !== comment.id),
                                            }));
                                        }}
                                    />
                                ))}

                                <div className="addComment">
                                    <p><i className="bi bi-pencil-fill" /> Add a comment</p>
                                    <textarea
                                        name="commentText"
                                        id="commentText"
                                        placeholder="Write description here..."
                                        value={this.state.newComment}
                                        onChange={this.handleCommentChange}
                                    />
                                    <button onClick={this.handleAddComment}>Add a comment</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ThemeContext.Consumer>
        );
    }
}

export default Post;
