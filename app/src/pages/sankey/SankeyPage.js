import React from 'react'
import { constructSankey } from './SankeyAmcharts'
import { NavigationButtons } from '../../components/NavigationButtons'

import './SankeyPage.sass'

/**
 * Component of the cluster graph page
 */
class SankeyPage extends React.Component {

  componentDidMount() {
    this.chart = constructSankey();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div>
        <div id="chartdiv" style={{ width: "90%", height: "600px" }}></div>

        <NavigationButtons linkTo={this.props.linkTo}
          nextRoute={{ path: "/chord", text: "To actors" }}
          prevRoute={{ path: "/bubble", text: "Back to genres" }} />
      </div>
    );
  }
}

export { SankeyPage }