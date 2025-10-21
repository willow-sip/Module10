import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import AuthPage from './components/AuthPage/index';
import NotFoundPage from './components/NotFoundPage/index';
import UnauthorizedPage from './components/UnauthorizedPage/index'

import Header from './components/Header/index';
import AddPost from './components/AddPost/index'
import Footer from './components/Footer/index';
import Sidebar from './components/Sidebar/index';
import Post from './components/Post/index';

import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { defaultPosts } from "./data/posts"
import './App.css';


function App() {
  const { user, userAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const posts = [...defaultPosts];
  
  return (
    <div className={`app ${theme}`}>
      <Header user={user} />
      <Routes>
        <Route path="/" element={
          <>
            {userAuth && <AddPost user={user} />}
            <div className="main-page">
              {userAuth && <Sidebar recPeople={user.recPeople} recCommunities={user.recCommunities} />}
              <div className="posts">
                {posts.map((post, index) => (
                  <Post key={index} post={post} />
                ))}
              </div>
            </div>
          </>
        } />
        <Route path="/sign-up" element={<AuthPage mode="signup" />} />
        <Route path="/sign-in" element={<AuthPage mode="signin" />} />
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;