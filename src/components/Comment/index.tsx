'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Paper, Typography, TextField, Button, IconButton, Box, useTheme } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { animated, useSpring, config } from '@react-spring/web';
import { useQuery, useMutation } from '@tanstack/react-query';
const AnimatedPaper = animated(Paper);

interface CommentProps {
    id: number;
    authorId: number;
    text: string;
    edit?: (newText: string) => void;
    deleteComm?: () => void;
}

const Comment = ({ id, authorId, text, edit, deleteComm }: CommentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);
    const { token, user } = useContext(AuthContext);

    const fadeInSpring = useSpring({
        from: { opacity: 0, transform: 'translateY(-10px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: config.gentle,
    });

    const { data: author } = useQuery({
        queryKey: ['get-comment-author', authorId],
        queryFn: async () => {
            const response = await fetch(`/api/users/${authorId}`,
            { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
    });

    const editMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/comments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: editText.trim() }),
            });
            if (!response.ok){
                throw new Error(`Edit failed: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: (newComment) => {
            edit?.(newComment.text);
            setIsEditing(false);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/comments/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status}`);
            }
        },
        onSuccess: () => {
            deleteComm?.();
        },
        onError: (error) => {
            console.log(error);
        }
    });

    
    const canModify = user?.id === authorId;

    const handleEdit = () => {
        if (canModify) {
            setIsEditing(true);
            setEditText(text);
        }
    };

    const handleSaveEdit = () => {
        if (editText.trim()){
            editMutation.mutate();
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(text);
    };

    const handleDelete = () => { deleteMutation.mutate() };

    return (
        <AnimatedPaper
            elevation={0}
            sx={{
                p: 0,
                mb: '8px',
                bgcolor: 'transparent',
                maxWidth: 652,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
                color: 'var(--text-color)'
            }}
            style={fadeInSpring}
        >
            {isEditing ? (
                <Box >
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={4}
                        size="small"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        sx={{
                            width: 652,
                            height: 58,
                            bgcolor: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            '& .MuiInputBase-input': {
                                color: 'var(--text-color)',
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                            },
                            resize: 'none',
                        }}
                    />
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Button
                            sx={{
                                width: 211,
                                height: 44,
                                bgcolor: 'var(--footer-text-color)',
                                p: '12 48',
                                mt: '12px',
                                border: 'none',
                                borderRadius: 0,
                                color: 'var(--text-color)',
                                textTransform: 'none',
                            }}
                            onClick={handleCancelEdit}
                        >Cancel</Button>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={!editText.trim()}
                            sx={{
                                width: 211,
                                height: 44,
                                bgcolor: 'var(--footer-text-color)',
                                p: '12 48',
                                mt: '12px',
                                border: 'none',
                                borderRadius: 0,
                                color: 'var(--text-color)',
                                textTransform: 'none',
                            }}
                        >Save</Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ fontFamily: 'inherit', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        <Typography component="span" fontWeight="bold" sx={{ mr: 0.5 }}>
                            {author?.firstName} {author?.secondName}:
                        </Typography>
                        {text}
                    </Typography>
                    <>
                        {canModify && (
                            <Box sx={{ display: 'flex', gap: '8px' }}>
                                <IconButton
                                    onClick={handleEdit}
                                    sx={{ color: 'var(--text-color)' }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={handleDelete}
                                    sx={{ color: 'var(--text-color)' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </>
                </Box>
            )}
        </AnimatedPaper>
    );
};

export default Comment;
