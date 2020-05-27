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

const genreDescriptions = {
  "Action": `Plays out mainly through a clash of physical forces. Frequently these stories have fast cuts, tough characters making quick decisions and usually a beautiful girl nearby. Anything quick and most likely a thin storyline.`,
  "Adventure": `Exploring new places, environments or situations. This is often associated with people on long journeys to places far away encountering amazing things, usually not in an epic but in a rather gripping and interesting way.`,
  "Cars": `Anime whose central theme revolves around cars and probably car races. A single character's obsession for cars does not mean that it should belong to this genre. Most of these stories also are in the action genre.`,
  "Comedy": `Multiple characters and/or events causing hilarious results. These stories are built upon funny characters, situations and events.`,
  "Dementia": `Anime that have mind-twisting plots.`,
  "Demons": `Anime that are set in a world where demons and other dark creatures play a significant role - the main character may even be one.`,
  "Drama": `Anime that often show life or characters through conflict and emotions. In general, the different parts of the story tend to form a whole that is greater than the sum of the parts. In other words, the story has a message that is bigger than just the story line itself.`,
  "Ecchi": `Anime that contain a lot of sexual innuendo. The translation of this letter (Ecchi is the letter 'H' in Japanese) is pervert. Ecchi is about panties (pantsu) and bra/breast showing, situations with "sudden nudity" and of course, subtle hints or sexual thoughts. Ecchi does not describe actual sex acts or show any intimate body parts except for bare breasts and buttocks. Ecchi is almost always used for humor.`,
  "Fantasy": `Anime that are set in a mythical world quite different from modern-day Earth. Frequently this world has magic and/or mythical creatures such as dragons and unicorns. These stories are sometimes based on real world legends and myths. Frequently fantasies describe tales featuring magic, brave knights, damsels in distress, and/or quests.`,
  "Game": `Anime whose central theme is based on a non-violent, non-sports game, like go, chess, trading card games or computer/video games.`,
  "Harem": `Anime that involves one lead male character and many cute/pretty female support characters. Typically, the male lead ends up living with many female support characters within the same household. The lead male typically represents the average guy who is shy, awkward, and girlfriendless. While each female character surround the lead male possesses distinct physical and personality traits, those traits nevertheless represent different stereotypical roles that play on popular Japanese fetishes; i.e. the librarian/genius, tomboy, little sister, and older woman. Some anime that are under the harem genre are: Love Hina, Girls Bravo, Maburaho, and Sister Princess.`,
  "Hentai": `Anime whose central theme is explicit sex. Hentai is sex with usually a very small storyline, comparable with normal porn. Hentai can range from normal couple's sexual relationship to a wide variety of fetishes and perversions.`,
  "Historical": `Anime whose setting is in the past. Frequently these follow historical tales, sagas or facts.`,
  "Horror": `Anime whose focus is to scare the audience.`,
  "Josei": ``,
  "Kids": `Anime whose target audience is children. This does not necessarily mean that the character(s) are children or that an anime whose main character(s) are children is appropriate for this genre.`,
  "Magic": `Anime whose central theme revolves around magic. Things that are "out of this world" happen - incidents that cannot be explained by the laws of nature or science. Usually wizards/witches indicate that it is of the "Magic" type. This is a sub-genre of fantasy.`,
  "Martial Arts": `Anime whose central theme revolves around martial arts. This includes all hand-to-hand fighting styles, including Karate, Tae-Kwon-Do and even Boxing. Weapons use, like Nunchaku and Shuriken are also indications of this genre. This is a sub-genre of action.`,
  "Mecha": `Anime whose central theme involves mechanical things. This genre is mainly used to point out when there are giant robots. Human size androids are in general not considered "Mecha" but "SciFi".`,
  "Military": `An anime series/movie that has a heavy militaristic feel behind it.`,
  "Music": `Anime whose central theme revolves around singers/idols or people playing instruments. This category is not intended for finding AMVs (Animated Music Videos).`,
  "Mystery": `Anime where characters reveal secrets that may lead a solution for a great mystery. This is not necessarily solving a crime, but can be a realization after a quest.`,
  "Parody": `Anime that imitate other stories (can be from TV, film, books, historical events, ...) for comic effect by exaggerating the style and changing the content of the original. Also known as spoofs. This is a sub-genre of comedy.`,
  "Police": `Anime where a police organization are a major part of the story.`,
  "Psychological": `Often when two or more characters prey each others' minds, either by playing deceptive games with the other or by merely trying to demolish the other's mental state.`,
  "Romance": `Anime whose story is about two people who each want [sometimes unconciously] to win or keep the love of the other. This kind of anime might also fall in the "Ecchi" category, while "Romance" and "Hentai" generally contradict each other.`,
  "Samurai": `Anime whose main character(s) are samurai, the old, but not forgotten, warrior cast of medieval Japan.`,
  "School": `Anime which are mainly set in a school environment.`,
  "Sci-Fi": `Anime where the setting is based on the technology and tools of a scientifically imaginable world. The majority of technologies presented are not available in the present day and therefore the Science is Fiction. This incorporates any possible place (planets, space, underwater, you name it).`,
  "Seinen": `Seinen is a genre/demographic that is aimed primarily at the male, college-aged/young adult demographic. Seinen anime and manga tend to be a little bit more mature than it’s counterpart, Shounen, which is aimed at younger boys.`,
  "Shoujo": `Anime that are targeted towards the "young girl" market. Usually the story is from the point of view of a girl and deals with romance, drama or magic.`,
  "Shoujo Ai": `Anime whose central theme is about a relationship (or strong affection, not usually sexual) between two girls or women. Shoujo Ai literally means "girl love".`,
  "Shounen": `Anime that are targeted towards the "young boy" market. The usual topics for this involve fighting, friendship and sometimes super powers.`,
  "Shounen Ai": `Anime whose central theme is about a relationship (or strong affection, not usually sexual) between two boys or men. Shounen Ai literally means "boy love", but could be expressed as "male bonding".`,
  "Slice of Life": `Anime with no clear central plot. This type of anime tends to be naturalistic and mainly focuses around the main characters and their everyday lives. Often there will be some philosophical perspectives regarding love, relationships, life etc. tied into the anime. The overall typical moods for this type of anime are cheery and carefree, in other words, it is your "feel-good" kind of anime. Some anime that are under the slice of life genre are: Ichigo Mashimaro, Fruits Basket, Aria the Natural, Honey and Clover, and Piano.`,
  "Space": `Anime whose setting is in outer space, not on another planet, nor in another dimension, but space. This is a sub-genre of scifi.`,
  "Sports": `Anime whose central theme revolves around sports, examples are tennis, boxing and basketball.`,
  "Super Power": `Anime whose main character(s) have powers beyond normal humans. Often it looks like magic, but can't really be considered magic; usually ki-attacks, flying or superhuman strength.`,
  "Supernatural": `Anime of the paranormal stature. Demons, vampires, ghosts, undead, etc.`,
  "Thriller": ``,
  "Vampire": `Anime whose main character(s) are vampires or at least vampires play a significant role in the story.`,
  "Yaoi": `Anime whose central theme is a sexual relationship between two boys or men. This implies Hentai.`,
  "Yuri": `Anime whose central theme is a sexual relationship between two girls or women. This implies Hentai.`,
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
      hoveringAnime: null
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
        <Sidebar position={{ left: 0, top: 0 }} appearTransitionClass="fadeInRight">
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
      [
        <h1>43</h1>,<h2>genres to classify them all</h2>,
        <p>In this data visualization, we showcase the distribution of animes across the genres.
        The size of the bubble is proportional to the number of animes with that genre.

          </p>,
        <p></p>,
        <p>Click on a genre to zoom into it. One can then see the 50 animes that represent the most the genre.
          The displayed number and the size of the bubble represent the number of people that had that anime as favorite.</p>,
        <p>Hover or click on an anime to see more information about the anime.</p>,
      ])
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