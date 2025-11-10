import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';

import './style.css';


interface CommentProps {
    id: number;
    authorId: number;
    text: string;
    edit?: (newText: string) => void;
    deleteComm?: () => void;
}

const Comment = ({ id, authorId, text, edit, deleteComm }: CommentProps) => {
    const [author, setAuthor] = useState({ id: NaN, username: '', firstName: '', secondName: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);
    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        fetch(`/api/users/${authorId}`, {
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
                setAuthor(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [authorId, token]);

    const canModify = user?.id === authorId;

    const handleEdit = () => {
        if (!canModify) return;
        setIsEditing(true);
        setEditText(text);
    };

    const handleSaveEdit = () => {
        fetch(`/api/comments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: editText.trim() }),
        })
            .then(res => {
                if (!res.ok) throw new Error(`Edit failed: ${res.status}`);
                return res.json();
            })
            .then(newComment => {
                if (edit) {
                    edit(newComment.text);
                    setIsEditing(false);
                }
            }).catch(err => console.error(err));
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(text);
    };

    const handleDelete = () => {
        if (!canModify) return;

        fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
                if (deleteComm) {
                    deleteComm();
                }
            }).catch(err => console.error(err));
    };

    return (
        <div className="comment">
            {isEditing ? (
                <div className="editMode">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                    />
                    <div className="editActions">
                        <button onClick={handleSaveEdit} disabled={!editText.trim()}>
                            Save
                        </button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <p>{author.firstName} {author.secondName}: {text}</p>
                    {canModify && (
                        <div className="editComment">
                            <button className="editButton" onClick={handleEdit}>
                                <i className="bi bi-pencil-square" />
                            </button>
                            <button className="deleteButton" onClick={handleDelete}>
                                <i className="bi bi-trash-fill" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Comment;
