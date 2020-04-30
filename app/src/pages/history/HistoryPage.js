import React from 'react'
import { WOW } from 'wowjs'

import { LoadingScreen } from '../../components/LoadingScreen'

import './HistoryPage.sass'
import scrollHintGif from './scroll_down.gif'

/**
 * History graph page component
 */
class HistoryPage extends React.Component {
    constructor() {
        super()
        // init state with empty data and loading flag
        this.state = {
            data: [],
            loading: true,
        }
    }

    componentDidMount() {
        // fetch the data from the server
        fetch(`${process.env.PUBLIC_URL}/data/history.json`)
            .then(response => response.json())
            .then(newData => {
                this.setState({
                    data: newData,
                    loading: false
                })

                // inform wow that DOM has changed
                this.wow.sync()
            })

        // initialize wow animations (fade-in on viewport)
        this.wow = new WOW({
            mobile: true,
            live: true
        })
        this.wow.init()
    }

    render() {
        return (
            <div id="History">
                {this.state.loading ? <LoadingScreen /> : (
                    <div className="GraphView">
                        <div className="Left">
                            <div id="Histogram">
                                {Object.entries(this.state.data).map((yearToAnime, index) => {
                                    const [year, animes] = yearToAnime
                                    const animationDelay = `${index * 0.01 % 0.4}s`
                                    return (
                                        <div className="row wow fadeInUp" key={year} data-wow-delay={animationDelay}>
                                            <span className="year">{year}</span>
                                            <div className="dots">{animes.map(anime => <div className="dot" key={anime.anime_id}>&nbsp;</div>)}</div>
                                        </div>
                                    )
                                })}
                                <div id="HistogramBottom">
                                    <p>&nbsp;</p>
                                </div>
                                <div className="ScrollHint">
                                    <div>
                                        <img src={scrollHintGif} alt="Scroll down" />
                                        <p>Scroll down</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Right">

                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export { HistoryPage }