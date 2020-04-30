import React from 'react'

import './HomePage.sass'

/**
 * Import all backgrounds from img / bg
 */
const files = require.context('./img/', false, /\.(gif)$/)
const backgrounds = files.keys().map(item => files(item))

/**
 * Component of the home page
 */
class HomePage extends React.Component {
    constructor() {
        super()
        this.randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]
    }

    render() {
        return (
            <div id="Home" style={{ backgroundImage: `url('${this.randomBackground}')` }}>
                <div className="Splash">
                    <div className="Background">
                        <p>&nbsp;</p>
                    </div>
                    <div className="Foreground">
                        <h1>Anime Data Visualization</h1>
                        <p>An interactive data visualization experience by Alexandre CHAU, Pedro TORRES DA CUNHA & Joachim DUNANT for the COM-480 course</p>
                        <button onClick={() => this.props.linkTo('/history')}>Let's start!</button>
                    </div>
                </div>
            </div>
        )
    }
}

export { HomePage }