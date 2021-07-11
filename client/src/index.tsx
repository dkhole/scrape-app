import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './index.css';
import { Scrape } from './components/scrape/Scrape';
import { Login } from './components/login/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { AutoMsg } from './components/auto-msg/AutoMsg';

ReactDOM.render(
  <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/api">
            <Dashboard />
          </Route>
          <Route exact path="/api/scrape">
            <Scrape />
          </Route>
          <Route exact path="/api/auto-msg">
            <AutoMsg />
          </Route>
          <Route exact path="/">
            <Login />
          </Route>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
