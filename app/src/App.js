import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.sass';

import { HomePage } from './pages/home/HomePage'
import { HistoryPage } from './pages/history/HistoryPage'
import { TopAnimesPage } from './pages/topAnimes/TopAnimesPage'
import { BubblePage } from './pages/bubble/BubblePage'
import { ChordPage } from './pages/chord/ChordPage'
import { SankeyPage } from './pages/sankey/SankeyPage'
import { WithTransition } from './animation/WithTransition'

/**
 * App class: entry point of this application
 * Renders the matched route with the corresponding page
 */
class App extends React.Component {
  render() {
    return (
      <div id="App">
        <Router>
          <Switch>
            <Route path="/history" component={WithTransition(HistoryPage)} />
            <Route path="/topAnimes" component={WithTransition(TopAnimesPage)} />
            <Route path="/bubble" component={WithTransition(BubblePage)} />
            <Route path="/chord" component={WithTransition(ChordPage)} />
            <Route path="/sankey" component={WithTransition(SankeyPage)} />
            <Route path="/" component={WithTransition(HomePage)} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
