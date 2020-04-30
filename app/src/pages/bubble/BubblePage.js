import React from 'react'
import rd3 from 'react-d3-library'
import { constructBubble } from './BubbleD3'
import './BubblePage.sass'

const RD3Component = rd3.Component;

/**
 * Component of the cluster graph page
 */
class BubblePage extends React.Component {
    constructor(props) {
      super(props)
      this.state = {d3: ''}
    }
  
    componentDidMount() {
      fetch(`${process.env.PUBLIC_URL}/data/genre_data.json`)
        .then(res => res.json())
        .then(json => this.setState({
          d3:constructBubble(json)
        }))
      
    }
  
    render() {
      return (
        <div>
          <RD3Component data={this.state.d3} />
        </div>
      )
    }
}

export { BubblePage }