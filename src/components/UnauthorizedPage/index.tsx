import React from 'react';
import './style.css';

const NotFoundPage = () => (
  <div className="error-page">
    <img className="error401" src="./imgs/401error.png" alt="Image of error 401" />
    <h1>Oops...<br />Something bad has just happened</h1>
  </div>
);

export default NotFoundPage;
