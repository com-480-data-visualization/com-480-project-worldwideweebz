import React from 'react'
import * as d3 from "d3"

import './BubblePage.sass'

import { Config } from '../../Config'
import { Wrapper, GraphView, Sidebar } from '../../components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

import genreDescriptions from '../../components/GenreDescriptions.json'

const DisplayState = {
  FETCHING: 1,
  DISPLAY: 2,
  FOCUSED: 3
}

/**
 * Component of the cluster graph page
 */
class BubblePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      genres: [],
      subBubble: [],
      height: 0,
      offsetX: 0,
      offsetY: 0,
      scale: 0,
      activeGenre: null,
      activeAnime: null,
      displayedGenres: [],
      showingFilter: false,
      hoveringGenre: null,
      hoveringAnime: null,
      exit: false
    }

    this.diameter = 600
    this.radius = this.diameter / 2
    this.ratio = 0.8
    this.displayState = DisplayState.FETCHING
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions() {
    const bubble_root = document.getElementById("bubble-root")
    const bubbleRootSize = Math.min(bubble_root.clientWidth, bubble_root.clientHeight)
    const offset = (1 - this.ratio) * bubbleRootSize / 2
    this.setState({
      offsetX: offset + (bubble_root.clientWidth - bubbleRootSize) / 2,
      offsetY: offset + (bubble_root.clientHeight - bubbleRootSize) / 2,
      scale: this.ratio * bubbleRootSize / this.diameter,
      height: bubble_root.clientHeight,
    })
  }

  createGenreBubble() {
    const displayed = this.data.filter(genre => this.state.displayedGenres[genre.name])

    this.bubblePositions = createBubblePositions(displayed, this.diameter, "count").map(x => { return { x: x.x, y: x.y, r: x.r } })

    const bubbleData = displayed.map((x, idx) => {
      return {
        name: x.name,
        count: x.count,
        image: x.image,
        representative: x.representative_anime,
        x: this.bubblePositions[idx].x,
        y: this.bubblePositions[idx].y,
        r: this.bubblePositions[idx].r,
      }
    })

    this.setState({ genres: bubbleData })

  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions)

    // register callback when route changes
    this.props.onRouteChange(path => {
      if (path !== "/bubble") {
        this.setState({
          exit: true,
        })
      }
    })

    fetch(`${process.env.PUBLIC_URL}/data/genre_data.json`)
      .then(res => res.json())
      .then(json => {
        this.data = json
        this.setState({
          displayedGenres: this.data.reduce((result, item) => {
            result[item.name] = true
            return result
          }, {}),
          showingFilter: true
        })
        this.createGenreBubble()
      })

    fetch(`${process.env.PUBLIC_URL}/data/genre_top_animes_data.json`)
      .then(res => res.json()).then(json => this.topAnimesPerGenre = json)
    Config.addObserver(this)
  }

  componentWillUnmount() {
    Config.removeObserver(this)
    window.removeEventListener("resize", this.updateDimensions)
  }

  onConfigUpdate(newConfig) {

  }

  focusGenre(focusedGenre) {
    if (!this.topAnimesPerGenre) return

    const genreTopAnimes = this.topAnimesPerGenre[focusedGenre.name]
    const bubblePositions = createBubblePositions(genreTopAnimes, this.diameter, "favorites").map(x => { return { x: x.x, y: x.y, r: x.r } })

    const focusIdx = this.state.genres.findIndex(b => b.name === focusedGenre.name)

    const fx = this.bubblePositions[focusIdx].x
    const fy = this.bubblePositions[focusIdx].y
    const fr = this.bubblePositions[focusIdx].r

    this.setState({
      subBubble: genreTopAnimes.map((anime, idx) =>
        Object.assign(Object.assign({}, anime), {
          name: anime.title,
          image: anime.image_url,
          x: bubblePositions[idx].x,
          y: bubblePositions[idx].y,
          r: bubblePositions[idx].r,
          oppacity: 1.0
        })
      ),

      genres: this.state.genres.map((g, idx) => {
        if (g.name === focusedGenre.name) return {
          name: g.name,
          count: g.count,
          image: g.image,
          representative: g.representative,
          x: this.radius,
          y: this.radius,
          r: this.radius,
        }

        const x = this.bubblePositions[idx].x
        const y = this.bubblePositions[idx].y
        const r = this.bubblePositions[idx].r

        const diffX = x - fx
        const diffY = y - fy
        const dist = Math.sqrt(diffX * diffX + diffY * diffY)

        return {
          name: g.name,
          count: g.count,
          image: g.image,
          representative: g.representative,
          x: this.radius + (this.radius - fr) * (diffX / dist) + diffX,
          y: this.radius + (this.radius - fr) * (diffY / dist) + diffY,
          r: r,
        }
      }),

      activeGenre: focusedGenre,
      activeAnime: null
    })
    this.displayState = DisplayState.DISPLAY
  }

  resetGenre() {
    const data = this.state.genres;
    for (let idx = 0; idx < data.length; ++idx) {
      data[idx].x = this.bubblePositions[idx].x
      data[idx].y = this.bubblePositions[idx].y
      data[idx].r = this.bubblePositions[idx].r
    }
    this.setState({
      subBubble: [],
      activeGenre: null,
      genres: data,
      activeAnime: null,
    })
  }

  genreDisplayToggle(genre) {
    if (this.state.activeGenre) return
    const displayedGenres = this.state.displayedGenres
    displayedGenres[genre] ^= true
    this.setState({
      displayedGenres: displayedGenres,
      activeGenre: null
    })
    this.createGenreBubble()
    this.displayState = DisplayState.FETCHING
  }

  setAllGenresDisplayTo(bool) {
    if (this.state.activeGenre) return

    const displayedGenres = this.state.displayedGenres
    Object.keys(displayedGenres).forEach(genre => displayedGenres[genre] = bool)

    this.setState({
      displayedGenres: displayedGenres
    })
    this.createGenreBubble()
    this.displayState = DisplayState.FETCHING
  }

  // render

  render() {
    let bubbleData = this.state.genres
    let focusedData = this.state.subBubble
    switch (this.displayState) {
      case DisplayState.FETCHING:
        if (bubbleData.length > 0) {
          this.displayState = DisplayState.DISPLAY;
          bubbleData = bubbleData.map(genre => Object.assign(Object.assign({}, genre), { x: this.radius, y: this.radius, r: 0 }))
          setTimeout(() => this.forceUpdate(), 0)
        }
        break
      case DisplayState.DISPLAY:
        if (this.state.activeGenre !== "") {
          this.displayState = DisplayState.FOCUSED
          focusedData = focusedData.map(anime => Object.assign(Object.assign({}, anime), { oppacity: 0.0 }))
          setTimeout(() => this.forceUpdate(), 0)
        }
        break

      case DisplayState.FOCUSED:
        if (this.state.activeGenre === "") {
          this.displayState = DisplayState.DISPLAY
        }
        break

      default:
    }

    bubbleData = bubbleData.filter(genre => this.state.displayedGenres[genre.name])
    return (
      <Wrapper>
        <Sidebar position={{ left: 0, top: 0 }} appearTransitionClass={this.state.exit ? "fadeOutRight" : "fadeInRight"}>
          <div className="SidebarContent">
            {this.renderSidebarContent()}
          </div>
        </Sidebar>
        <GraphView position={{ right: 0 }}>
          <div id="bubble-root">
            {this.renderGenreFiltering()}
            <div id="bubble-return"
              style={{ display: (this.state.activeGenre ? "inline-block" : "none") }}
              onClick={() => this.resetGenre()}>Reset chart</div>
            <svg onClick={() => this.resetGenre()}>
              <defs>
                <pattern id="nsfw" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                  <image height="1" width="1" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" href={`${process.env.PUBLIC_URL}/img/nsfw.png`}></image>
                </pattern>
                {this.state.genres.map(genre =>
                  <pattern key={genre.name} id={genre.name.replace(/\s/g, '')} height="100%" width="100%" patternContentUnits="objectBoundingBox">
                    <image height="1" width="1" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" href={genre.image}></image>
                  </pattern>
                )}
                {this.state.subBubble.map(anime =>
                  <pattern key={anime.name} id={anime.name.replace(/\s/g, '')} height="100%" width="100%" patternContentUnits="objectBoundingBox">
                    <image height="1" width="1" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" href={anime.image}></image>
                  </pattern>
                )}
              </defs>
              {bubbleData.map(genre => this.renderGenreBubble(genre))}
              {focusedData.map(anime => this.renderAnimeBubble(anime))}
            </svg>
          </div>
        </GraphView>
      </Wrapper>
    )
  }

  renderGenreBubble(genre) {
    return <g
      className={"bubble genre" + (this.state.activeGenre && genre.name === this.state.activeGenre.name ? " active-genre" : "")}
      key={genre.name}
      style={{ transform: `translate(${this.state.scale * genre.x + this.state.offsetX}px, ${this.state.scale * genre.y + this.state.offsetY}px) scale(${this.state.scale * genre.r / 100})` }}
      onClick={(e) => { this.focusGenre(genre); e.stopPropagation() }}
      onMouseEnter={() => this.setState({ hoveringGenre: genre })}
      onMouseLeave={() => this.setState({ hoveringGenre: null })}
    >
      <circle r="100" style={{ fill: `url(#${Config.detectNSFW(genre.name) ? "nsfw" : genre.name.replace(/\s/g, '')})` }}></circle>
      <text dy=".2em"
        fontFamily="sans-serif" fontSize="20" fill="white">{genre.name}</text>
      <text dy="1.3em" fontFamily="Gill Sans" fontSize="20" fill="white">{genre.count}</text>
    </g>
  }

  renderAnimeBubble(anime) {
    return <g
      className={"bubble anime" + (this.state.activeAnime && anime.name === this.state.activeAnime.name ? " active-anime" : "")}
      key={anime.name}
      style={{ transform: `translate(${this.state.scale * anime.x + this.state.offsetX}px, ${this.state.scale * anime.y + this.state.offsetY}px) scale(${this.state.scale * anime.r / 100})`, fillOpacity: anime.oppacity }}
      onClick={(e) => { this.setState({ activeAnime: this.state.activeAnime && this.state.activeAnime.title === anime.title ? null : anime }); e.stopPropagation() }}
      onMouseEnter={() => this.setState({ hoveringAnime: anime })}
      onMouseLeave={() => this.setState({ hoveringAnime: null })}
    >
      <circle r="100" style={{ fill: `url(#${Config.detectNSFW(anime.genre.toString()) ? "nsfw" : anime.title.replace(/\s/g, '')})` }}></circle>
      <text dy=".2em"
        fontFamily="sans-serif" fontSize="20" fill="white">{cropText(anime.name, 18)}</text>
      <text dy="1.3em" fontFamily="Gill Sans" fontSize="20" fill="white">{anime.favorites}</text>
    </g>
  }

  renderGenreFiltering() {
    return <div id="filter-genres" style={this.state.activeGenre ? { display: "none" } : {}}>
      <div id="show-filter" onClick={() => this.setState({ showingFilter: !this.state.showingFilter })}>Filter the genres <FontAwesomeIcon icon={this.state.showingFilter ? faChevronUp : faChevronDown} style={{ width: "16px", height: "16px" }} /></div>
      <ul style={this.state.showingFilter ? { maxHeight: `${this.state.height - 40}px`, overflowY: "scroll" } : {}}>
        <ul className="pin">
          <li onClick={() => this.setAllGenresDisplayTo(true)}
            className={Object.values(this.state.displayedGenres).reduce((acc, item) => acc &= item, true) ? "disable" : ""}>ALL</li>
          <li onClick={() => this.setAllGenresDisplayTo(false)}
            className={Object.values(this.state.displayedGenres).reduce((acc, item) => acc |= item, false) ? "" : "disable"}>NONE</li>
        </ul>

        {Object.entries(this.state.displayedGenres).map(([genre, checked]) =>
          <li className={this.state.displayedGenres[genre] ? "selected" : "not-selected"}
            key={"checkbox" + genre}
            onClick={() => this.genreDisplayToggle(genre)}>
            {genre}
          </li>)}
      </ul>
    </div>
  }

  // Sidebar rendering

  renderSidebarContent() {
    if (this.state.activeAnime) {
      return this.renderAnimeDescription(this.state.activeAnime)
    } else if (this.state.hoveringGenre) {
      return this.renderGenreDescription(this.state.hoveringGenre)
    } else if (this.state.hoveringAnime) {
      return this.renderAnimeDescription(this.state.hoveringAnime)
    } else if (this.state.activeGenre) {
      return this.renderGenreDescription(this.state.activeGenre)
    } else {
      return this.renderPageDescription()
    }
  }

  renderPageDescription() {
    return (
      <div>
        <h1>43</h1>, <h2>genres to classify them all</h2>
        <p>
          In this data visualization, we showcase the distribution of animes across the genres.
          The size of the bubble is proportional to the number of animes with that genre.
        </p>
        <p>
          On the right, you can select the genres you want to display.
          Click on <span style={{ fontWeight: 500 }}>NONE</span> to remove them all and progressively add the genres you are interested in.
        </p>
        <p>
          Click on a genre to zoom into it. You can then see the 50 animes that represent the most the genre.
          The displayed number and the size of the bubble represent the number of people that had that anime as favorite.
        </p>
        <p>Hover or click on an anime to see more information about the anime.</p>
      </div>
    )
  }

  renderGenreDescription(genre) {
    return [
      <h2>{genre.name}</h2>,
      <p><span style={{ fontWeight: 600 }}>Description: </span>{genreDescriptions[genre.name]}</p>,
      <p><span style={{ fontWeight: 600 }}>Number of animes: </span>{genre.count}</p>,
      <p><span style={{ fontWeight: 600 }}>Representative anime: </span>{genre.representative}</p>,
    ]
  }

  renderAnimeDescription(anime) {
    return [
      // display close button if anime has been clicked
      this.state.activeAnime ?
        <FontAwesomeIcon icon={faTimesCircle} color="#fff" size="3x"
          className="close-icon"
          onClick={(event) => this.setState({ activeAnime: null })}
          style={{ float: "right", margin: "0 0 15px 15px", cursor: "pointer" }} />
        : null,
      <h2>{anime.title}</h2>,
      // Image should not be null
      (anime.image_url === null) ? null :
        // If settings disable NSFW, check if anime.genre exists and contains sensitive genres
        ("genre" in anime && Config.detectNSFW(anime.genre.toString())) ?
          <img src={`${process.env.PUBLIC_URL}/img/nsfw.png`} alt="NSFW" /> :
          <img src={anime.image_url} alt={anime.title} />
      ,
      <p><span style={{ fontWeight: 600 }}>Favorites: </span>{anime.favorites}</p>,
      <p><span style={{ fontWeight: 600 }}>Score: </span>{anime.score}</p>,
      <p><span style={{ fontWeight: 600 }}>Episode count: </span>{anime.episodes}</p>,
      <p><span style={{ fontWeight: 600 }}>Aired: </span>{anime.aired_string}</p>,
      <p><span style={{ fontWeight: 600 }}>Type: </span>{anime.type}</p>,
      <p><span style={{ fontWeight: 600 }}>Source: </span>{anime.source}</p>,
      <p><span style={{ fontWeight: 600 }}>Duration: </span>{anime.duration}</p>,
      <p><span style={{ fontWeight: 600 }}>Producer: </span>{anime.producer}</p>,
      <p><span style={{ fontWeight: 600 }}>Studio: </span>{anime.studio}</p>,
      <p><span style={{ fontWeight: 600 }}>Genre: </span>{anime.genre}</p>,
      <p><span style={{ fontWeight: 600 }}>MyAnimeList ID: </span>{anime.anime_id}</p>,
    ]
  }
}



function createBubblePositions(data, diameter, sizeAttribute, padding = 2) {
  const bubbleDataset = { "children": data }
  const bubble = d3.pack(bubbleDataset)
    .size([diameter, diameter])
    .padding(padding)
  const nodes = d3.hierarchy(bubbleDataset)
    .sum(function (d) { return d[sizeAttribute] })
  return bubble(nodes).descendants().slice(1)
}

function cropText(text, size) {
  if (text.length > size) return text.slice(0, size - 3) + "..."
  else return text
}

export { BubblePage }