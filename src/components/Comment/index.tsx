import './style.css';
import React from 'react';

interface CommentProps {
    comment: {
        user: string;
        text: string;
    };
}

const Comment: React.FC<CommentProps> = ({ comment }) => (
    <div className="comment">
        <strong>{comment.user}</strong>: {comment.text}
    </div>
);

export default Comment;
