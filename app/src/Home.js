import React from 'react'

/**
 * Import all backgrounds from img / bg
 */
const files = require.context('./img/bg', false, /\.(gif)$/)
const backgrounds = files.keys().map(item => files(item))

/**
 * Component of the home page
 */
class Home extends React.Component {
    render() {
        // Choose a random background
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

        return (
            <div id="Home" style={{ backgroundImage: `url('${randomBackground}')` }}>
                <div class="Splash">
                    <div class="Background">
                        <p>&nbsp;</p>
                    </div>
                    <div class="Foreground">
                        <h1>Anime Data Visualization</h1>
                        <p>An interactive data visualization experience by Alexandre CHAU, Pedro TORRES DA CUNHA & Joachim DUNANT for the COM-480 course</p>
                        <button>Let's start!</button>
                    </div>
                </div>
            </div>
        )
    }
}

export { Home }