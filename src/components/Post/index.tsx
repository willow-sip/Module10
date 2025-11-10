import React, { Component } from 'react';
import Comment from '../Comment';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import { showNotification } from '@/components/notify';
import { Post as PostType, User, Comment as CommentType } from '@/data/datatypes';

import { PostContainer, Author, Avatar, LoadingAvatar, AuthorInfo, AuthorName, PublishTime, PostImage, PostTitle, PostContent, PostButtons,
  Button, Likes, Comments, CommentSection, AddComment, AddCommentHeader, CommentTextarea, AddCommentButton, Spinner, AnimatedHeart} from './Post.styles';


interface PostProps {
    post: PostType;
    t: (key: string) => string;
}

interface PostState {
    showComments: boolean;
    comments: CommentType[] | undefined;
    author: User;
    liked: boolean;
    likesCount: number;
    newComment: string;
    prevToken: string | null;
    loading: boolean;
    addingComment: boolean;
    animateLike: boolean;
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
            loading: true,
            addingComment: false,
            animateLike: false,
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
        this.setState({ addingComment: true });

        const commentData = {
            postId: Number(postId),
            text: newComment.trim(),
        };

        fetch('/api/comments', {
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
                        addingComment: false,
                    }));
                    showNotification('Comment updated!', 'success', 2000);
                }
            }).catch(err => console.error(err));
    };

    handleLike = () => {
        const { liked } = this.state;
        const { token, user } = this.context; 
        const postId = this.props.post.id;

        this.setState({ animateLike: true });
        setTimeout(() => {
            this.setState({ animateLike: false });
        }, 400);

        const endpoint = liked ? '/api/dislike' : '/api/like';
        const method = 'POST';

        fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ postId }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log(data)
                if (data) {
                    this.setState(prevState => ({
                        liked: !prevState.liked,
                        likesCount: prevState.liked
                            ? (prevState.likesCount - 1)
                            : prevState.likesCount + 1,
                    }));
                } else {
                    showNotification('Failed to toggle like', 'error', 2000);
                }
            })
            .catch(err => {
                console.error('Error toggling like:', err);
                showNotification('Network error', 'error', 2000);
            });
    };

    loadCommentsAndAuthor = () => {
        const id: number = this.props.post.id;
        const { token, user } = this.context;

        if (user && token) {
            fetch(`/api/posts/${id}/comments`, {
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

            fetch(`/api/users/${this.props.post.authorId}`, {
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
                    console.log(data);
                    this.setState(() => ({
                        author: data,
                        loading: false
                    }));
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
        const t = this.props.t;

        return (
            <ThemeContext.Consumer>
                {theme => (
                    <PostContainer theme={theme}>
                        {this.state.loading ? (
                            <Author>
                                <LoadingAvatar />
                                <AuthorInfo>
                                    <Spinner />
                                </AuthorInfo>
                            </Author>
                        ) : (
                            <Author>
                                <Avatar
                                    src={profileImage || './imgs/default-avatar.jpg'}
                                    alt="Post author avatar"
                                />
                                <AuthorInfo>
                                    <AuthorName>{firstName} {secondName}</AuthorName>
                                    <PublishTime>{this.calculatePublishTime()}</PublishTime>
                                </AuthorInfo>
                            </Author>
                        )}

                        {image && <PostImage src={image} alt="Post" />}
                        <PostTitle>{title}</PostTitle>
                        <PostContent>{content}</PostContent>

                        <PostButtons>
                            <Likes>
                                <AnimatedHeart
                                    className={this.state.liked ? 'bi bi-suit-heart-fill' : 'bi bi-suit-heart'}
                                    animate={this.state.animateLike.toString()}
                                    onClick={this.handleLike}
                                />
                                {this.state.likesCount} {t('likes')}
                            </Likes>
                            <Comments>
                                <i className="bi bi-chat-left" />
                                <span className="comment-text">
                                    {userAuth
                                        ? commentsCount !== undefined
                                            ? `${commentsCount} ${t('commentsCount')}`
                                            : t('loadingComments')
                                        : t('loginToSeeComments')}
                                </span>
                            </Comments>
                            {userAuth && (
                                <Button onClick={this.toggleShowComments}>
                                    {showComments ? (
                                        <i className="bi bi-chevron-down" />
                                    ) : (
                                        <i className="bi bi-chevron-up" />
                                    )}
                                </Button>
                            )}
                        </PostButtons>

                        {showComments && (
                            <CommentSection>
                                {comments?.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        id={comment.id}
                                        authorId={comment.authorId}
                                        text={comment.text}
                                        edit={(newText) => {
                                            this.setState((prev) => ({
                                                comments: prev.comments?.map((prevCom) =>
                                                    prevCom.id === comment.id ? { ...prevCom, text: newText } : prevCom
                                                ),
                                            }));
                                            showNotification(t('updateComment'), 'success', 2000);
                                        }}
                                        deleteComm={() => {
                                            this.setState((prev) => ({
                                                comments: prev.comments?.filter((c) => c.id !== comment.id),
                                            }));
                                            showNotification(t('deleteComment'), 'success', 2000);
                                        }}
                                    />
                                ))}

                                <AddComment>
                                    <AddCommentHeader>
                                        <i className="bi bi-pencil-fill" /> {t('addComment')}
                                    </AddCommentHeader>
                                    <CommentTextarea
                                        name="commentText"
                                        id="commentText"
                                        placeholder={t('commentPlaceholder')}
                                        value={this.state.newComment}
                                        onChange={this.handleCommentChange}
                                    />
                                    <AddCommentButton
                                        onClick={this.handleAddComment}
                                        disabled={this.state.addingComment}
                                        adding={this.state.addingComment.toString()}
                                    >
                                        {this.state.addingComment ? t('addingComment') : t('addComment')}
                                    </AddCommentButton>
                                </AddComment>
                            </CommentSection>
                        )}
                    </PostContainer>

                )}
            </ThemeContext.Consumer>
        );
    }
}

export default Post;
