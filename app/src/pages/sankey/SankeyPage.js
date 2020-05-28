import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMouse } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

import './SankeyPage.sass'
import { Wrapper, GraphView, Sidebar } from '../../components/Layout'

import { constructSankey } from './SankeyAmcharts'

/**
 * Component of the cluster graph page
 */
class SankeyPage extends React.Component {
  constructor() {
    super()
    this.state = {
      type: null,
      display: null,
      exit: false,
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

    // register callback when route changes
    this.props.onRouteChange(path => {
      if (path !== "/sankey") {
        this.setState({
          exit: true,
        })
      }
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
        return (
          <div className="StudiosExplanation">
            <h1>711</h1>
            <h2>Studios providing entertainment to the whole world</h2>
            <p className="CallToAction"><FontAwesomeIcon icon={faMouse} color="#fff" /> Hover on a studio or genre to learn more about it</p>
            <p>Here, we show the number of animes that a studio has per genre and their average score. We take the top 10 studios, depending on the number of anime or movies that they aired, and the top 5 most represented genres.</p>
            <p>You can put your mouse on a link to show its size and highlight the full track from studio to score going through the specific genre. Furthermore, clicking a node will minimize it.</p>
          </div>
        )

      case "studio":
        const studio = this.state.display
        return (
          <div className="StudioDetails">
            <h2>{studio.name}</h2>
            <img src={studio.image} alt={studio.name} />
            <p>{studio.description}</p>
            <p><b>Location: </b> {studio.hq}</p>
            <p><b>Founded: </b> {studio.date}</p>
            <p><b>Top 3 animes of the studio:</b></p>
            <table>
              {studio.top.map(anime =>
                <tr>
                  <td className="ImageCell">
                    <img src={anime.image} alt={anime.name} />
                  </td>
                  <td>
                    <p>{anime.title}</p>
                    <p>{anime.aired}</p>
                    <p>View count: {anime.views}</p>
                  </td>
                </tr>
              )}
            </table>
          </div>
        )

      case "genre":
        const genre = this.state.display
        return (
          <div>
            <h2>{genre.name}</h2>
            <p>{genre.description}</p>
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
          <Sidebar appearTransitionClass={this.state.exit ? "fadeOutLeft" : "fadeInLeft"}>
            <div className="SidebarContent">
              { // Show close button if any details info is shown
                this.state.type === null ? null :
                  <FontAwesomeIcon icon={faTimesCircle} color="#fff" size="3x"
                    onClick={() => this.setDisplay(null, null)}
                    style={{ float: "right", margin: "0 0 15px 15px", cursor: "pointer" }} />
              }
              {this.renderSidebar()}
            </div>
          </Sidebar>
        </Wrapper>

      </div>
    );
  }
}

export { SankeyPage }