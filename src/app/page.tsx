'use client';

import { useContext, useEffect, useState, Suspense } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import AddPost from '@/components/AddPost';
import Sidebar from '@/components/Sidebar';
import { Post } from '@/data/datatypes';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

const DynamicPost = dynamic(() => import('@/components/Post'), {
  loading: () => <p>Loading post...</p>,
});

export default function HomePage() {
  const { user, userAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const { t } = useTranslation();

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='app' data-theme={theme}>
      {userAuth && user && <AddPost avatar={user?.profileImage} postCreated={fetchPosts} />}
      <div className="main-page">
        {userAuth && user && <Sidebar t={t} />}
        <div className="posts">
          <Suspense fallback={<div>Loading posts...</div>}>
            {posts.map(post => (
              <DynamicPost key={post.id} post={post} t={t} />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
