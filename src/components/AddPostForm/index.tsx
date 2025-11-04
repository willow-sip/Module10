import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext'
import './style.css';

interface Props {
    close: () => void;
    postCreated: () => void;
}

const AddPostForm = ({ close, postCreated }: Props) => {
    const { theme } = useContext(ThemeContext);
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const notContext = useNotification();


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                notContext.showNotification("File size mustn't exceed 10MB", 'error', 3000);
                return;
            }
            
            const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!fileTypes.includes(selectedFile.type)) {
                notContext.showNotification('Invalid file type( not *.jpg, *.png or *.pdf)', 'error', 3000);
                return;
            }
            
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            notContext.showNotification('Input post title please', 'warning', 2000);
            return;
        }

        if (!description.trim()) {
            notContext.showNotification('Input description please', 'warning', 2000);
            return;
        }

        if (!token) {
            notContext.showNotification('You are somehow not authorized', 'error', 3000);
            return;
        }

        const formData: { title: string; content: string; image?: File } = {
            title: title,
            content: description,
        };

        if (file) {
            formData.image = file;
        }
        try {
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                notContext.showNotification('Failed to create a post.', 'error', 3000);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            notContext.showNotification('Post created successfully', 'success', 3000);

            if (postCreated) {
                postCreated();
            }

            setTitle('');
            setDescription('');
            setFile(null);

            close();

        } catch (error) {
            notContext.showNotification('Failed to create a post.', 'error', 3000);
        }
    };

    return (
        <div className="blur" data-theme={theme}>
            <div className="form-container">
                <div className="form-header">
                    <h2>Create a new post</h2>
                    <button className="close-form-button" onClick={close}>×</button>
                </div>

                <form id="add-post" onSubmit={handleSubmit}>
                    <div className="form-group title">
                        <label htmlFor="postTitle">
                            <i className="bi bi-envelope"></i> Post Title
                        </label>
                        <input
                            id="postTitle"
                            type="text"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <i className="bi bi-pencil"></i> Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Write description here..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="upload-area">
                        <i className="bi bi-file-earmark-arrow-up" />
                        <div className="upload-content">
                            <p>{file ? `Uploaded file: ${file.name}.` : 'Select a file or drag and drop here'}</p>
                            <p className="file-types">JPG, PNG or PDF, file size no more than 10MB</p>
                        </div>
                        <input
                            type="file"
                            accept=".jpg,.png,.pdf"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </div>
                    <button type="submit" className="create-btn">Create</button>
                </form>
            </div>
        </div>
    );
};

export default AddPostForm;