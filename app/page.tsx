'use client';

import { useContext, useEffect, useState, Suspense } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import Header from '@/components/Header';
import AddPost from '@/components/AddPost';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Post from '@/components/Post';
import { Post as PostType } from '@/data/datatypes';

export default function HomePage() {
  const { user, userAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={`app ${theme}`}>
      <Header name={`${user?.firstName} ${user?.secondName}`} avatar={user?.profileImage} />
      {userAuth && user && <AddPost avatar={user?.profileImage} postCreated={fetchPosts} />}
      <div className="main-page">
        {userAuth && user && <Sidebar />}
        <div className="posts">
          <Suspense fallback={<div>Loading posts...</div>}>
            {posts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
