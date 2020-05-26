import React from 'react'
import { constructSankey } from './SankeyAmcharts'

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
      </div>
    );
  }
}

export { SankeyPage }