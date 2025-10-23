import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';

import AuthPage from './components/AuthPage';
import NotFoundPage from './components/NotFoundPage';
import UnauthorizedPage from './components/UnauthorizedPage';

import Header from './components/Header';
import AddPost from './components/AddPost';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Post from './components/Post';

import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import { defaultPosts, Post as PostType } from './data/posts';
import './App.css';

const App: React.FC = () => {
  const { user, userAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const posts: PostType[] = defaultPosts;

  return (
    <div className={`app ${theme}`}>
      <Header name={user?.name} avatar={user?.avatar} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {userAuth && user && <AddPost user={user} />}
              <div className="main-page">
                {userAuth && user && (
                  <Sidebar
                    recPeople={user.recPeople}
                    recCommunities={user.recCommunities}
                  />
                )}
                <div className="posts">
                  {posts.map((post, index) => (
                    <Post key={index} post={post} />
                  ))}
                </div>
              </div>
            </>
          }
        />
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
