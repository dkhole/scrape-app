import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './index.css';
import { Scrape } from './components/scrape/Scrape';
import { Login } from './components/login/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { AutoMsg } from './components/auto-msg/AutoMsg';
import checkAuth from './components/auth/checkAuth';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/api" component={checkAuth(Dashboard)} />
        <Route exact path="/api/scrape" component={checkAuth(Scrape)}/>
        <Route exact path="/api/auto-msg" component={checkAuth(AutoMsg)} />
        <Route exact path="/" component={Login} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
