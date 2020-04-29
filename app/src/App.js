import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './style.sass';

import { Home } from './Home'

function App() {
  return (
    <div id="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          {/* Route definitions: WARNING order matters, first prefix match! */}
          <Route path="/genres">
            <p></p>
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
