'use client';

import { Suspense } from 'react';
import { useTheme } from '@/context/ThemeContext';
import AddPost from '@/components/AddPost';
import Sidebar from '@/components/Sidebar';
import { Post } from '@/data/datatypes';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { tokenApi } from '@/tokenApi';

const DynamicPost = dynamic(() => import('@/components/Post'), {
  loading: () => <p>Loading post...</p>,
});

export default function HomePage() {
  const { user, userAuth } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme();

  const { data: posts = [], refetch } = useQuery({
    queryKey: ['get-posts'],
    queryFn: async () => {
      const response = await tokenApi.get('/posts');
      return response;
    },
  });

  return (
    <div className='app' data-theme={theme}>
      {userAuth && user && <AddPost avatar={user?.profileImage} postCreated={refetch} />}
      <div className="main-page">
        {userAuth && user && <Sidebar />}
        <div className="posts">
          <Suspense fallback={<div>Loading posts...</div>}>
            {posts.map((post: Post) => (
              <DynamicPost key={post.id} post={post} />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
