import React from 'react';
import './style.css';

const NotFoundPage: React.FC = () => (
  <div className="error-page">
    <i className="bi bi-x" />
    <h1>Oops...<br />Something bad has just happened</h1>
  </div>
);

export default NotFoundPage;
