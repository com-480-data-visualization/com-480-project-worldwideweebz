import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.sass';

import { HomePage } from './pages/HomePage'
import { ClusterPage } from './pages/ClusterPage'
import { WithTransition } from './animation/WithTransition'

/**
 * App class: entry point of this application
 * Renders the matched route with the corresponding page
 */
class App extends React.Component {
  render() {
    return (
      <div id="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/cluster" component={WithTransition(ClusterPage)} />
            <Route path="/" component={HomePage} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
