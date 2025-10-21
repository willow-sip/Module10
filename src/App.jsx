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

import { AppContext } from './context/AppContext';
import './App.css';

const defaultPosts = [
  {
    author: { name: 'Helena Hills', avatar: '' },
    publishTime: new Date('2025-10-13T08:42:17'),
    image: 'https://i.pinimg.com/736x/a5/32/9b/a5329bab2e151c77ef041fa59e133bad.jpg',
    caption: 'Post description',
    likes: 12,
    comments: [{ user: 'Alex', text: 'Super cool and astonishing' }]
  },
  {
    author: { name: 'Charles', avatar: '' },
    publishTime: new Date('2025-10-11T14:05:33'),
    caption: 'Chillin’ by the ocean 🌊',
    likes: 45,
    comments: [
      { user: 'Sam', text: 'Wish I was there!' },
      { user: 'Jamie', text: 'Looks amazing!' }
    ]
  },
  {
    author: { name: 'Daniel Jay Park', avatar: '' },
    publishTime: new Date('2025-10-09T21:18:02'),
    image: 'https://i.pinimg.com/736x/98/64/42/986442f8aa1b3845237c2105522bbc7c.jpg',
    caption: 'Morning fuel ☕️',
    likes: 28,
    comments: [
      { user: 'Taylor', text: 'What blend is that?' },
      { user: 'Jordan', text: 'I need this every morning!' }
    ]
  }
];


function App() {
  const { user, theme, userAuth } = useContext(AppContext);

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
                {defaultPosts.map((post, index) => (
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