import React from 'react'
import { Link } from 'react-router-dom'

import './HomePage.sass'

/**
 * Import all backgrounds from img / bg
 */
const files = require.context('../img/bg', false, /\.(gif)$/)
const backgrounds = files.keys().map(item => files(item))

/**
 * Component of the home page
 */
class HomePage extends React.Component {
    render() {
        // Choose a random background
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

        return (
            <div id="Home" style={{ backgroundImage: `url('${randomBackground}')` }}>
                <div className="Splash">
                    <div className="Background">
                        <p>&nbsp;</p>
                    </div>
                    <div className="Foreground">
                        <h1>Anime Data Visualization</h1>
                        <p>An interactive data visualization experience by Alexandre CHAU, Pedro TORRES DA CUNHA & Joachim DUNANT for the COM-480 course</p>
                        <Link to="/cluster">
                            <button>Let's start!</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export { HomePage }