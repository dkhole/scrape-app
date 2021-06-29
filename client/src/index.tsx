import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './index.css';
import App from './App';
import Login from './Login';
import Dashboard from './Dashboard';

ReactDOM.render(
  <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/app">
            <App />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
