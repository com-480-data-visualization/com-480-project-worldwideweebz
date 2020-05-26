import React from 'react'
import { constructChord } from './ChordAmcharts'

import './ChordPage.sass'

/**
 * Component of the cluster graph page
 */
class ChordPage extends React.Component {
  componentDidMount() {
	  fetch(`${process.env.PUBLIC_URL}/data/vA_datasets.json`)
      .then(res => res.json())
      .then(json => {
           this.chart = constructChord(json)
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
		<select id="filter">
			<option>Japanese</option>
			<option>English</option>
			<option>Korean</option>
			<option>Italian</option>
			<option>French</option>
			<option>Spanish</option>
			<option>German</option>
			<option>Hungarian</option>
			<option>Brazilian</option>
			<option>Hebrew</option>
			<option>Mandarin</option>
		</select>
		<select id="top">
			<option>5</option>
			<option>10</option>
			<option selected>20</option>
			<option>30</option>
			<option>40</option>
		</select>
        <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>
      </div>
    );
  }
}

export { ChordPage }