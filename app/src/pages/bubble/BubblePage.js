import React from 'react'
import rd3 from 'react-d3-library'
import { constructBubble, updateBubble } from './BubbleD3'
import { NavigationButtons } from '../../components/NavigationButtons'

import './BubblePage.sass'

const RD3Component = rd3.Component;

/**
 * Component of the cluster graph page
 */
class BubblePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { d3: '' }
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/data/genre_data.json`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          d3: constructBubble(json)
        })
      })

  }

  render() {
    return (
      <div>
        <RD3Component data={this.state.d3} />

        <NavigationButtons linkTo={this.props.linkTo}
          nextRoute={{ path: "/sankey", text: "To studios" }}
          prevRoute={{ path: "/topAnimes", text: "Back to top animes" }} />
      </div>
    )
  }

  componentDidUpdate() {
    updateBubble()
  }
}

export { BubblePage }