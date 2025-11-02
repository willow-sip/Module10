import { useEffect, useContext, useState } from 'react';
import './style.css';

import { User } from '../../data/datatypes'
import { AuthContext } from '../../context/AuthContext'

interface CommentType {
    authorId: number;
    text: string;
}

const Comment = ({ authorId, text }: CommentType) => {
    const [author, setAuthor]: [User, unknown] = useState({ id: NaN, username: '' });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetch(`http://localhost:3000/api/posts/${authorId}/author`, {
            headers: {
                Authorization: `${token}`,
            },
        })
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
    }, [authorId, token])

    return (
        <div className="comment">
            <strong>{author.firstName}</strong>: {text}
        </div>
    );
};

export default Comment;
