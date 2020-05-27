import React from 'react'
import { constructSankey } from './SankeyAmcharts'
import { Wrapper, GraphView, Sidebar } from '../../components/Layout'

import './SankeyPage.sass'

/**
 * Component of the cluster graph page
 */
class SankeyPage extends React.Component {
  constructor() {
    super()
    this.state = {
      type: null,
      display: null,
    }

    this.setDisplay = this.setDisplay.bind(this)
    this.renderSidebar = this.renderSidebar.bind(this)
  }

  setDisplay(object, type) {
    this.setState({
      type: type,
      display: object,
    })
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/data/sankey_dataset.json`)
      .then(res => res.json())
      .then(json => {
        this.chart = constructSankey(json, this.setDisplay)
      })
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  renderSidebar() {
    switch (this.state.type) {
      case null:
        return <h2>Rounded notes per genre per studio</h2>
      case "studio":
        return (
          <div>
            <h2>{this.state.display.name}</h2>
          </div>
        )
    }
  }

  render() {
    return (
      <div id="Studios">
        <Wrapper>
          <GraphView>
            <div id="chartdiv"></div>
          </GraphView>
          <Sidebar>
            <div className="SidebarContent">
              { // discriminate object to display on sidebar

              }
            </div>
          </Sidebar>
        </Wrapper>

      </div>
    );
  }
}

export { SankeyPage }