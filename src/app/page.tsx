'use client';

import { useContext, Suspense } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import AddPost from '@/components/AddPost';
import Sidebar from '@/components/Sidebar';
import { Post } from '@/data/datatypes';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

const DynamicPost = dynamic(() => import('@/components/Post'), {
  loading: () => <p>Loading post...</p>,
});

export default function HomePage() {
  const { user, userAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const { data: posts = [], refetch } = useQuery({
    queryKey: ['get-posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        console.error("Couldn't fetch posts");
        return;
      }
      return response.json();
    }
  });

  return (
    <div className='app' data-theme={theme}>
      {userAuth && user && <AddPost avatar={user?.profileImage} postCreated={refetch} />}
      <div className="main-page">
        {userAuth && user && <Sidebar t={t} />}
        <div className="posts">
          <Suspense fallback={<div>Loading posts...</div>}>
            {posts.map((post: Post) => (
              <DynamicPost key={post.id} post={post} t={t} />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
