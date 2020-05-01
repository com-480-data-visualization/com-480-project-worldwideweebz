import React from 'react'
import rd3 from 'react-d3-library'
import { constructTopAnimes, updateTopAnimes } from './TopAnimesD3'

import './TopAnimesPage.sass'
import { NavigationButtons } from '../../components/NavigationButtons';

const RD3Component = rd3.Component;

const data = {
    2010: ["anime A", "anime B", "anime C"],
    2011: ["anime D", "anime E"],
    2012: ["anime F", "anime G with text that is too long", "anime H", "anime I"],
    2013: ["anime J"],
    2014: ["anime K", "anime L"]
}

const years = Object.keys(data)

/**
 * Component of the cluster graph page
 */
class TopAnimesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { d3: '' }
    }

    componentDidMount() {
        this.setState({ d3: constructTopAnimes(data) })
    }

    componentDidUpdate() {
        updateTopAnimes(data)
    }

    render() {
        return (
            <div id="topAnimes-root">
                <div id="topAnimes-show">
                    {years.map(y => <div key={y} class="column"><ul>{data[y].map(anime => <li key={anime}>{anime}</li>)}</ul></div>)}
                </div>
                <RD3Component data={this.state.d3} />

                <NavigationButtons linkTo={this.props.linkTo}
                    nextRoute={{ path: "/bubble", text: "To genres" }}
                    prevRoute={{ path: "/history", text: "Back to history" }} />
            </div>
        )
    }
}

export { TopAnimesPage }