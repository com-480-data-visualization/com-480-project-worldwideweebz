import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faCircle } from '@fortawesome/free-solid-svg-icons'

import './HistoryPage.sass'
import scrollHintGif from './scroll_down.gif'

import { Config } from '../../Config'
import { ColorUtils } from '../../utils/ColorUtils'
import { LoadingScreen } from '../../components/LoadingScreen'
import { WOWAnimation } from '../../animation/WOWAnimation'
import { Wrapper, GraphView, Sidebar } from '../../components/Layout'

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
            selected: null,
            clicked: null,
            exit: false,
        }

        /* Compute the color function: should rescale [min, max] # of episodes
           into [light, dark] shades of given color */
        const limits = {
            maxCount: 50,
            minCount: 0,
            maxShade: -90,
            minShade: 60
        }
        const ratio = (limits.maxShade - limits.minShade) / (limits.maxCount - limits.minCount)
        this.shadeColor = (color, episodeCount) => {
            if (episodeCount > limits.maxCount) episodeCount = limits.maxCount
            return ColorUtils.shade(color, ratio * episodeCount + limits.minShade)
        }

        // bind local methods
        this.setSelected = this.setSelected.bind(this)
        this.setClicked = this.setClicked.bind(this)
        this.onConfigUpdate = this.onConfigUpdate.bind(this)
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

                // inform WOW animation that DOM has changed
                WOWAnimation.sync()
            })

        // register callback when route changes
        this.props.onRouteChange(path => {
            if (path !== "/history") {
                this.setState({
                    exit: true,
                })
            }
        })

        Config.addObserver(this)
    }

    componentWillUnmount() {
        Config.removeObserver(this)
    }

    onConfigUpdate(newConfig) {
        this.setState({
            config: newConfig
        })
    }

    setSelected(anime) {
        this.setState({
            selected: anime,
        })
    }

    setClicked(anime, event) {
        event.stopPropagation()
        this.setState({
            clicked: anime,
        })
    }

    // scrolls a fixed amount of pixels
    scroll() {
        window.scrollBy({
            top: 400,
            behavior: "smooth"
        })
    }

    renderHistogram() {
        return (
            <div id="Histogram" onClick={(event) => this.setClicked(null, event)}>
                {Object.entries(this.state.data).map((yearToAnime, index) => {
                    const [year, animes] = yearToAnime
                    const animationDelay = `${index * 0.01 % 0.5}s`
                    return (
                        <div className="row wow fadeInUp" key={year} data-wow-delay={animationDelay}>
                            <span className="year">{year}</span>
                            <div className="dots">
                                {animes.map(anime => {
                                    const bgColor = { backgroundColor: this.shadeColor("#F59B00", anime.episodes) }
                                    return (
                                        <div className="dot"
                                            onMouseEnter={this.state.clicked === null ? () => this.setSelected(anime) : () => { }}
                                            onMouseLeave={this.state.clicked === null ? () => this.setSelected(null) : () => { }}
                                            onClick={(event) => this.setClicked(anime, event)}
                                            key={anime.anime_id}
                                            style={bgColor}>
                                            <p>&nbsp;</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                <div id="HistogramBottom">
                    <p>&nbsp;</p>
                </div>
                <div className="ScrollHint">
                    <div onClick={this.scroll}>
                        <img src={scrollHintGif} alt="Scroll down" />
                        <p>Scroll down</p>
                    </div>
                </div>
            </div>
        )
    }

    renderSidebar() {
        const anime = (this.state.clicked !== null) ? this.state.clicked : this.state.selected
        return (
            <div id="HistogramDetails">
                {anime === null ?
                    (
                        <div className="Infos">
                            <h1>100</h1>
                            <h2>years of anime</h2>

                            <p class="Definition">
                                <FontAwesomeIcon icon={faQuoteLeft} color="#eee" size="3x" style={{ float: "left", margin: "0 10px 0 0" }} />
                                Anime (Japanese: アニメ) is hand-drawn and computer animation originating from Japan often characterized by colorful graphics, vibrant characters and fantastical themes. The earliest commercial Japanese animation dates to 1917, and Japanese anime production has since continued to increase steadily. The characteristic anime art style emerged in the 1960s with the works of Osamu Tezuka and spread internationally in the late 20th century. Japanese anime accounted for 60% of the world's animated television shows as of 2016.
                                <br /><span style={{ float: "right" }}>"Anime" on wikipedia.org</span>
                            </p>

                            <p>In this data visualization, we explore the sheer increase in volume of anime production over the years. Each dot is an anime title and its color shade represents its total episode count. We can observe that the number of anime produced per year is steadily growing, and that animes in the 60s tend to have large episode counts over several years, while recent works are generally much shorter, which is explained by an increase of standalone movies, promotional material, OVAs and single-season cours.</p>

                            <p>Hover on each dot to learn more about an anime.</p>
                        </div>
                    ) :
                    (
                        <div className="AnimeDetails">
                            <h2>{anime.title}</h2>
                            { // Image should not be null
                                (anime.image_url === null) ? null :
                                    // If settings disable NSFW, check if anime.genre exists and contains sensitive genres
                                    ("genre" in anime && Config.detectNSFW(anime.genre)) ?
                                        <img src={`${process.env.PUBLIC_URL}/img/nsfw.png`} alt="NSFW" /> :
                                        <img src={anime.image_url} alt={anime.title} />
                            }
                            <p>
                                Episode count: {anime.episodes}
                                <FontAwesomeIcon icon={faCircle}
                                    color={this.shadeColor("#F59B00", anime.episodes)}
                                    style={{ marginLeft: "5px", border: "1px solid #666", borderRadius: "100%" }}
                                />
                            </p>
                            <p>Aired: {anime.aired_string}</p>
                            <p>Type: {anime.type}</p>
                            <p>Source: {anime.source}</p>
                            <p>Duration: {anime.duration}</p>
                            <p>Producer: {anime.producer}</p>
                            <p>Studio: {anime.studio}</p>
                            <p>Genre: {anime.genre}</p>
                            <p>MyAnimeList ID: {anime.anime_id}</p>
                        </div>
                    )
                }
                <div class="Scale">
                    <div class="Gradient">
                        <p class="ScaleLabel">Episode count scale</p>
                        <p class="Min">1</p>
                        <p class="Max">&gt;= 50</p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div id="History">
                {this.state.loading ? <LoadingScreen /> : (
                    <Wrapper>
                        <GraphView>
                            {this.renderHistogram()}
                        </GraphView>
                        <Sidebar appearTransitionClass={this.state.exit ? "fadeOutLeft" : "fadeInRight"}>
                            {this.renderSidebar()}
                        </Sidebar>
                    </Wrapper>
                )}
            </div>
        )
    }
}

export { HistoryPage }