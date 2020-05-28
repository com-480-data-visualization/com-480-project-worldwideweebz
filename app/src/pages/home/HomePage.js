import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFirefoxBrowser } from '@fortawesome/free-brands-svg-icons'
import { faArchive, faDesktop, faRedoAlt } from '@fortawesome/free-solid-svg-icons'

import './HomePage.sass'
import { ConfigPanel } from '../../Config'

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
                        <p>An interactive data visualization experience based on the MyAnimeList dataset by Alexandre CHAU, Pedro TORRES DA CUNHA &amp; Joachim DUNANT for the COM-480 course</p>

                        <p>
                            For the best experience:
                            <br /><FontAwesomeIcon icon={faFirefoxBrowser} /> Use Mozilla Firefox for perfomance
                            <br /><FontAwesomeIcon icon={faArchive} /> Clear your browser cache (Ctrl + F5)
                            <br /><FontAwesomeIcon icon={faDesktop} /> Use a 1920x1080 maximized window
                            <br /><FontAwesomeIcon icon={faRedoAlt} /> Refresh this page for more backgrounds :)
                        </p>
                        <ConfigPanel />
                        <button onClick={() => this.props.linkTo('/history')}>Let's start!</button>
                    </div>
                </div>
            </div>
        )
    }
}

export { HomePage }