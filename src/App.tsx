import { Routes, Route } from 'react-router-dom';
import { Suspense, useContext, useEffect, useState } from 'react';

import AuthPage from './components/AuthPage';
import NotFoundPage from './components/NotFoundPage';
import UnauthorizedPage from './components/UnauthorizedPage';

import Header from './components/Header';
import AddPost from './components/AddPost';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Post from './components/Post';
import Stats from './components/Stats';
import Profile from './components/Profile';

import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { Post as PostType } from './data/datatypes';
import './App.css';

const App = () => {
  const { user, userAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className={`app ${theme}`}>
      <Header name={`${user?.firstName} ${user?.secondName}`} avatar={user?.profileImage} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {userAuth && user && <AddPost avatar={user?.profileImage} />}
              <div className="main-page">
                {userAuth && user && (
                  <Sidebar />
                )}
                <div className="posts">
                  <Suspense fallback={<div>Loading posts...</div>}>
                    {posts.map(post => (
                      <Post key={post.id} post={post} />
                    ))}
                  </Suspense>
                </div>
              </div>
            </>
          }
        />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-up" element={<AuthPage mode="signup" />} />
        <Route path="/sign-in" element={<AuthPage mode="signin" />} />
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
      <Footer />
    </div>
  );
};

export default App;
