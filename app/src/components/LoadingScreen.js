import React from 'react'

import loadingGifLeft from './img/loading1.gif'
import loadingGifRight from './img/loading2.gif'

import './LoadingScreen.sass'

/**
 * Loading screen reusable component
 * Displays a GIF loading animation
 */
class LoadingScreen extends React.Component {
    render() {
        return (
            <div className="LoadingScreen">
                <img src={loadingGifLeft} alt="Loading GIF" />
                <img src={loadingGifRight} alt="Loading GIF" />
                <h3>Loading and crunching the data...</h3>
                <p>Bits are coming your way!</p>
            </div>
        )
    }
}

export { LoadingScreen }