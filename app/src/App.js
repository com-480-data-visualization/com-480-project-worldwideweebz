import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.sass';

import { HomePage } from './pages/home/HomePage'
import { HistoryPage } from './pages/history/HistoryPage'
import { BubblePage } from './pages/bubble/BubblePage'
import { ChordPage } from './pages/chord/ChordPage'
import { SankeyPage } from './pages/sankey/SankeyPage'
import { WithTransition } from './animation/WithTransition'
import { WithMenu } from './components/Menu'
import { WOWAnimation } from './animation/WOWAnimation'

/**
 * App class: entry point of this application
 * Renders the matched route with the corresponding page
 */
class App extends React.Component {
  componentDidMount() {
    WOWAnimation.init()
  }

  render() {
    return (
      <div id="App">
        <Router>
          <Switch>
            <Route path="/history" component={WithTransition(WithMenu(HistoryPage))} />
            <Route path="/bubble" component={WithTransition(WithMenu(BubblePage))} />
            <Route path="/sankey" component={WithTransition(WithMenu(SankeyPage))} />
            <Route path="/chord" component={WithTransition(WithMenu(ChordPage))} />
            <Route path="/" component={WithTransition(HomePage)} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
