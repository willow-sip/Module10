import { useEffect } from 'react';
import './style.css';

import { User } from '../../data/datatypes'

interface CommentType {
    authorId: number;
    text: string;
}

const Comment = ({ authorId, text }: CommentType) => {
    let author: User = { id: NaN, username: '' };

    useEffect(() => {
        fetch(`http://localhost:3000/api/posts/${authorId}/author`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //author = data;
                //FAKE TEMPORARY REQUEST
            })
            .catch(error => {
                console.error(error);
            });
    }, [])

    return (
        <div className="comment">
            <strong>{author.firstName}</strong>: {text}
        </div>
    );
};

export default Comment;
