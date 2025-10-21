import React from 'react';
import './style.css';

const Comment = ({ comment }) => (
    <div className="comment">
        <strong>{comment.user}</strong>: {comment.text}
    </div>
);

export default Comment;
