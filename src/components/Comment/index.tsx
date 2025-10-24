import './style.css';
import React from 'react';

interface CommentType {
    user: string;
    text: string;
}

const Comment = ({ user, text } : CommentType) => (
    <div className="comment">
        <strong>{user}</strong>: {text}
    </div>
);

export default Comment;
