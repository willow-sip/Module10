import React from 'react';
import './styles/Comment.css';

const Comment = ({ comment }) => (
    <div className="comment">
        <strong>{comment.user}</strong>: {comment.text}
    </div>
);

export default Comment;
