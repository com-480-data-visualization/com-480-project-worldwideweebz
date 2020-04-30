import React from 'react'
import rd3 from 'react-d3-library'
import { bubbleRoot } from './BubbleD3'

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
      this.setState({d3: bubbleRoot})
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