import React from 'react'
import { constructSankey } from './SankeyAmcharts'

import './SankeyPage.sass'

/**
 * Component of the cluster graph page
 */
class SankeyPage extends React.Component {

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/data/sankey_dataset.json`)
      .then(res => res.json())
      .then(json => {
        this.chart = constructSankey(json)
      })
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