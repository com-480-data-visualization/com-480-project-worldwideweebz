import React from 'react'
import { constructChord } from './ChordAmcharts'
import { NavigationButtons } from '../../components/NavigationButtons'

import './ChordPage.sass'

/**
 * Component of the cluster graph page
 */
class ChordPage extends React.Component {

  componentDidMount() {
    this.chart = constructChord();
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
			<option>French</option>
		</select>
        <div id="chartdiv" style={{ width: "100%", height: "700px" }}></div>

        <NavigationButtons linkTo={this.props.linkTo}
          nextRoute={{ path: "/home", text: "Finish" }}
          prevRoute={{ path: "/sankey", text: "Back to studios" }} />
      </div>
    );
  }
}

export { ChordPage }