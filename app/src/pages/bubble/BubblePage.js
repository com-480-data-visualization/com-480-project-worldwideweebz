import React from 'react'
import * as d3 from "d3"

import './BubblePage.sass'

import { NavigationButtons } from '../../components/NavigationButtons'
import { Config } from '../../Config'

/**
 * Component of the cluster graph page
 */
class BubblePage extends React.Component {

  render() {
    return (
      <div>
        <BubbleChart />
        <NavigationButtons linkTo={this.props.linkTo}
          nextRoute={{ path: "/sankey", text: "To studios" }}
          prevRoute={{ path: "/topAnimes", text: "Back to top animes" }} />
      </div>
    )
  }
}

class BubbleChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      genres: [],
      subBubble: [],
      width: 0,
      height: 0,
      activeGenre: ""
    }

    this.diameter = 600
    this.radius = this.diameter / 2
    this.moved = false
    this.count = 0
  }

  updateDimensions() {
    const bubble_root = document.getElementById("bubble-root")
    this.setState({
      width: bubble_root.clientWidth,
      height: bubble_root.clientHeight,
    })
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this))
    
    fetch(`${process.env.PUBLIC_URL}/data/genre_data.json`)
      .then(res => res.json())
      .then(json => {
        const bubbleDataset = {"children": json}
        const bubble = d3.pack(bubbleDataset)
          .size([this.diameter, this.diameter])
          .padding(2)
        const nodes = d3.hierarchy(bubbleDataset)
            .sum(function(d) { return d.count })
        const bubblePositions = bubble(nodes).descendants()

        this.bubblePositions = bubblePositions.slice(1).map(x => {return {x: x.x, y: x.y, r: x.r}})

        this.setState({
          genres: json.map((x,idx) => {return {
            name: x.name,
            count: x.count,
            image: x.image,
            representative: x.representative_anime,
            x: this.radius,
            y: this.radius,
            r: 0,
          }})
        })

        requestAnimationFrame(() => 
          requestAnimationFrame(() => {
            const data = this.state.genres;
            for (let idx=0; idx < data.length; ++idx) {
              data[idx].x = this.bubblePositions[idx].x
              data[idx].y = this.bubblePositions[idx].y
              data[idx].r = this.bubblePositions[idx].r
            }
            this.setState({genres: data})
            this.moved = true
          })
        )
      })
    Config.addObserver(this)
  }

  componentWillUnmount() {
    Config.removeObserver(this)
  }

  onConfigUpdate(newConfig) {
    this.setState({genres: this.state.genres})
  }

  async focusBubble(genre) {

    if (!this.topAnimesPerGenre) {
      this.topAnimesPerGenre = await fetch(`${process.env.PUBLIC_URL}/data/genre_top_animes_data.json`)
                                    .then(res => res.json())
    }

    const genreTopAnimes = this.topAnimesPerGenre[genre.name]

    const bubbleDataset = {"children": genreTopAnimes}
    const bubble = d3.pack(bubbleDataset)
      .size([this.diameter, this.diameter])
      .padding(2)
    const nodes = d3.hierarchy(bubbleDataset)
        .sum(function(d) { return d.favorites })
    const bubblePositions = bubble(nodes).descendants()
    console.log(bubblePositions)

    const genreScale = this.diameter / (2 * genre.r)

    this.setState({
      subBubble: genreTopAnimes.map((x,idx) => {return {
        name: x.title,
        count: x.favorites,
        image: x.image_url,
        genre: x.genre,
        x: genre.x,
        y: genre.y,
        r: 0,
      }})
    })

    requestAnimationFrame(() => 
      requestAnimationFrame(() => {

        this.setState({
          subBubble: genreTopAnimes.map((x,idx) => {return {
            name: x.title,
            count: x.favorites,
            image: x.image_url,
            genre: x.genre,
            x: bubblePositions[idx + 1].x,
            y: bubblePositions[idx + 1].y,
            r: bubblePositions[idx + 1].r,
          }}),

          genres: this.state.genres.map(g => {return {
            name: g.name,
            count: g.count,
            image: g.image,
            x: this.radius + genreScale * (g.x - genre.x),
            y: this.radius + genreScale * (g.y - genre.y),
            r: genreScale * g.r,
          }}),

          activeGenre: genre.name
        })
      }))
  }

  render() {
    return (
      <div id="bubble-root">
        <svg width="100%" height="100%">
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
          {this.state.genres.map(genre =>
            <g className={"bubble" + (genre.name === this.state.activeGenre ? " active-genre" : "")} key={genre.name} style={{transform: `translate(${genre.x + (this.state.width - this.diameter) / 2}px, ${genre.y + (this.state.height - this.diameter) / 2}px) scale(${genre.r / 100})`}} onClick={() => this.focusBubble(genre)}>
              <circle r="100" style={{fill: `url(#${Config.detectNSFW(genre.name) ? "nsfw" : genre.name.replace(/\s/g, '')})`}}></circle>
              <text dy=".2em"
                fontFamily="sans-serif" fontSize="20" fill="white">{genre.name}</text>
              <text dy="1.3em" fontFamily="Gill Sans" fontSize="20" fill="white">{genre.count}</text>
            </g>
          )}
          {this.state.subBubble.map(anime =>
            <g className="bubble" key={anime.name} style={{transform: `translate(${anime.x + (this.state.width - this.diameter) / 2}px, ${anime.y + (this.state.height - this.diameter) / 2}px) scale(${anime.r / 100})`}}>
              <circle r="100" style={{fill: `url(#${Config.detectNSFW(anime.genre.toString()) ? "nsfw" : anime.name.replace(/\s/g, '')})`}}></circle>
              <text dy=".2em"
                fontFamily="sans-serif" fontSize="20" fill="white">{anime.name}</text>
              <text dy="1.3em" fontFamily="Gill Sans" fontSize="20" fill="white">{anime.count}</text>
          </g>
          )}
        </svg>
      </div>
    )
  }
}

export { BubblePage }