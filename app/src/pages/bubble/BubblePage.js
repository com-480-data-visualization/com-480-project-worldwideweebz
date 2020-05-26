import React from 'react'
import * as d3 from "d3"

import './BubblePage.sass'

import { Config } from '../../Config'
import { Wrapper, GraphView, Sidebar } from '../../components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

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
      width: 0,
      height: 0,
      activeGenre: "",
      displayedGenres: [],
      showingFilter: false
    }

    this.diameter = 600
    this.radius = this.diameter / 2
    this.moved = false
    this.count = 0
    this.displayState = DisplayState.FETCHING
  }

  updateDimensions() {
    const bubble_root = document.getElementById("bubble-root")
    this.setState({
      width: bubble_root.clientWidth,
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
    window.addEventListener("resize", this.updateDimensions.bind(this))

    fetch(`${process.env.PUBLIC_URL}/data/genre_data.json`)
      .then(res => res.json())
      .then(json => {
        this.data = json
        this.setState({
          displayedGenres: this.data.reduce((result, item) => {
            result[item.name] = true
            return result
          }, {})
        })
        this.createGenreBubble()
      })
    Config.addObserver(this)
  }

  componentWillUnmount() {
    Config.removeObserver(this)
  }

  onConfigUpdate(newConfig) {
    this.setState({ genres: this.state.genres })
  }

  async focusGenre(genre) {

    if (!this.topAnimesPerGenre) {
      this.topAnimesPerGenre = await fetch(`${process.env.PUBLIC_URL}/data/genre_top_animes_data.json`)
        .then(res => res.json())
    }

    const genreTopAnimes = this.topAnimesPerGenre[genre.name]
    const bubblePositions = createBubblePositions(genreTopAnimes, this.diameter, "favorites").map(x => { return { x: x.x, y: x.y, r: x.r } })

    const genreScale = this.diameter / (2 * genre.r)

    this.setState({
      subBubble: genreTopAnimes.map((x, idx) => {
        return {
          name: x.title,
          count: x.favorites,
          image: x.image_url,
          genre: x.genre,
          x: bubblePositions[idx].x,
          y: bubblePositions[idx].y,
          r: bubblePositions[idx].r,
        }
      }),

      genres: this.state.genres.map(g => {
        return {
          name: g.name,
          count: g.count,
          image: g.image,
          x: this.radius + genreScale * (g.x - genre.x),
          y: this.radius + genreScale * (g.y - genre.y),
          r: genreScale * g.r,
        }
      }),

      activeGenre: genre.name
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
      activeGenre: "",
      genres: data
    })
  }

  genreDisplayToggle(genre) {
    if (this.state.activeGenre !== "") return
    const displayedGenres = this.state.displayedGenres
    displayedGenres[genre] ^= true
    this.setState({
      displayedGenres: displayedGenres,
      activeGenre: ""
    })
    this.createGenreBubble()
    this.displayState = DisplayState.FETCHING
  }

  setAllGenresDisplayTo(bool) {
    if (this.state.activeGenre !== "") return

    const displayedGenres = this.state.displayedGenres
    Object.keys(displayedGenres).forEach(genre => displayedGenres[genre] = bool)

    this.setState({
      displayedGenres: displayedGenres
    })
    this.createGenreBubble()
    this.displayState = DisplayState.FETCHING
  }

  render() {
    console.log("RENDER")
    let bubbleData = this.state.genres
    let focusedData = this.state.subBubble
    switch (this.displayState) {
      case DisplayState.FETCHING:
        console.log("FETCHING")
        if (bubbleData.length > 0) {
          this.displayState = DisplayState.DISPLAY;
          bubbleData = bubbleData.map(genre => Object.assign(Object.assign({}, genre), { x: this.radius, y: this.radius, r: 0 }))
          setTimeout(() => this.forceUpdate(), 0)
        }
        break
      case DisplayState.DISPLAY:
        console.log("DISPLAY")
        if (this.state.activeGenre !== "") {
          this.displayState = DisplayState.FOCUSED
          focusedData = focusedData.map(anime => Object.assign(Object.assign({}, anime), { x: this.radius, y: this.radius, r: 0 }))
          setTimeout(() => this.forceUpdate(), 0)
          console.log(focusedData)
        }
        break

      case DisplayState.FOCUSED:
        console.log("FOCUSED")
        if (this.state.activeGenre === "") {
          this.displayState = DisplayState.DISPLAY
        }
        break

      default:
    }

    bubbleData = bubbleData.filter(genre => this.state.displayedGenres[genre.name])

    return (
      <Wrapper>
        <Sidebar position={{ left: 0 }} appearTransitionClass="fadeInLeft">

        </Sidebar>
        <GraphView position={{ right: 0 }}>
          <div id="bubble-root">
            <div id="filter-genres" style={this.state.activeGenre !== "" ? { display: "none" } : {}}>
              <div id="show-filter" onClick={() => this.setState({ showingFilter: !this.state.showingFilter })}>Filter the genres <FontAwesomeIcon icon={faChevronDown} style={{ width: "16px", height: "16px" }} /></div>
              <ul style={this.state.showingFilter ? { maxHeight: "600px", overflowY: "scroll" } : {}}>
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
            <div id="bubble-return"
              style={{ display: (this.state.activeGenre === "" ? "none" : "inline-block") }}
              onClick={() => this.resetGenre()}>Reset chart</div>
            <svg>
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
              {bubbleData.map(genre =>
                <g className={"bubble" + (genre.name === this.state.activeGenre ? " active-genre" : "")} key={genre.name} style={{ transform: `translate(${genre.x + (this.state.width - this.diameter) / 2}px, ${genre.y + (this.state.height - this.diameter) / 2}px) scale(${genre.r / 100})` }} onClick={() => this.focusGenre(genre)}>
                  <circle r="100" style={{ fill: `url(#${Config.detectNSFW(genre.name) ? "nsfw" : genre.name.replace(/\s/g, '')})` }}></circle>
                  <text dy=".2em"
                    fontFamily="sans-serif" fontSize="20" fill="white">{genre.name}</text>
                  <text dy="1.3em" fontFamily="Gill Sans" fontSize="20" fill="white">{genre.count}</text>
                </g>
              )}
              {focusedData.map(anime =>
                <g className="bubble" key={anime.name} style={{ transform: `translate(${anime.x + (this.state.width - this.diameter) / 2}px, ${anime.y + (this.state.height - this.diameter) / 2}px) scale(${anime.r / 100})` }}>
                  <circle r="100" style={{ fill: `url(#${Config.detectNSFW(anime.genre.toString()) ? "nsfw" : anime.name.replace(/\s/g, '')})` }}></circle>
                  <text dy=".2em"
                    fontFamily="sans-serif" fontSize="20" fill="white">{cropText(anime.name, 18)}</text>
                  <text dy="1.3em" fontFamily="Gill Sans" fontSize="20" fill="white">{anime.count}</text>
                </g>
              )}
            </svg>
          </div>
        </GraphView>
      </Wrapper>
    )
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