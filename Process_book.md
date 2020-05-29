<!--
    Compile with (requires pandoc and texlive):
    pandoc -V geometry:margin=2.5cm --variable urlcolor=cyan --number-sections -o Process_book.pdf Process_book.md
-->

---
header-includes:

 - \usepackage{fancyhdr}
 - \usepackage{multicol}
 - \pagestyle{fancy}
 - \fancyhead[CO,CE]{Data Visualization - Process Book}
 - \fancyfoot[CO,CE]{Alexandre CHAU, Pedro TORRES DA CUNHA, Joachim DUNANT - \today}
 - \fancyfoot[LE,RO]{\thepage}
 - \newcommand{\columnsbegin}{\begin{multicols*}{2}}
 - \newcommand{\columnsend}{\end{multicols*}}
---

\title{Process Book}
\author{Anime Data Visualization}
\date{Alexandre CHAU, Pedro TORRES DA CUNHA, Joachim DUNANT\\\today}
\maketitle

\vspace{0.5cm}

<!--
- Describe the path you took to obtain the final result
- Explain challenges that you faced and design decisions that you took
- Reuse the sketches/plans that you made for the first milestone, expanding them and explaining the changes
- Care about the visual/design of this report
- Peer assessment: include a breakdown of the parts of the project - completed by each team member.
-->

# Introduction

Animes have become a major source of digital entertainment, often narrating stories in beautiful or dreadful fantastical universes. Like with many works of fiction, one can escape to a different world, empathize with charismatic characters, discover a foreign culture or simply appreciate the art itself. They have grown exponentially in popularity over the years, in particular with Western audiences. The result is a rich byproduct of human creativity, globalization and commercialism.

In this context, we attempt to bring insightful visualizations about the raw numbers obtained from these works of art that we love, but also the people behind their creation. We want to showcase what makes them so unique, and bring forward the artists and companies that produce them. We showcase all animes registered on MyAnimeList from 1917 to 2018, their diversity through their genre classification, and detailed information about the studios and "seiyuus", the voice actors of the industry. Furthermore, we focus on an interactive, elegant and playful user experience so that our visualizations are not only informative, but also aesthetically pleasing.

# Problem statement

With our data visualization, we aim at answering the following questions:

- How has anime evolved from its earliest years in 1917 until now? How did the number of produced animes increase through time? Is the average number of episodes per anime title now greater or smaller?

- How do we categorize anime? How are anime titles distributed across genres? What are the most popular and most represented genres?

- What are the most popular studios? Which genres are the most prevalent for each of them and how are the works rated by their audience?

- What are the most popular voice actors, for each language? How does the "seiyuu" social connections network look like?

# Dataset

The dataset used to answer those questions is the [MyAnimeList Dataset](https://www.kaggle.com/azathoth42/myanimelist). It contains data about all animes up to 2018 from [MyAnimeList](https://myanimelist.net/), one of the biggest social platforms to discover, rate and review animes and mangas. Precise and detailed information about each anime can be extracted such as genres, studio, popularity, view count and more.

The voice actors are unfortunately not included in this dataset, although they are listed on the MAL website. However, we scrap them using the [Jikan API](https://jikan.moe/), an unofficial MyAnimeList API, to complete our data.

# Project structure

## Tools of the trade

To build our web application, we use the following frameworks and technologies:

- [ReactJS](https://reactjs.org/): a Javascript library for declarative, reactive user interfaces. ReactJS implements a MVVM pattern around functional principles which describes UI as a function of state. We leverage React to create isolated, reusable components that are composable, and focus on data changes and UI templates that are automatically re-rendered when state changes. With JSX, we can express declarative user interfaces with an HTML-like syntax augmented with inline Javascript features. Its hot-reload live server allows us to develop new features quickly with automatic stateful refreshes.
- [Babel](https://babeljs.io/): a Javascript compiler with enhanced ECMAScript 2015+ features that outputs browser-compatible ES5 code
- [Webpack](https://webpack.js.org/): a module bundler that performs packing and tree shaking on all Javascript, assets and dependencies to create optimized bundles. For instance, to use a Javascript library or a styling framework, one would usually need to link the complete JS or CSS files, while Webpack allows us to cherry-pick code, assets and styles with ES6 `import` statements and prune away all unused features.
- [SASS](https://sass-lang.com/): a CSS preprocessor with features such as variables, imports and nesting
- [D3](https://d3js.org/) and the [React D3](https://react-d3-library.github.io/) wrapper: Javascript library for documents manipulation, used to generate graph stubs
- [amCharts](https://www.amcharts.com/) a Javascript charting library
- [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start): a collection of navigational React components that emulate URLs and pages for client-side applications
- [FontAwesome](https://fontawesome.com/): a vectorized iconography toolset
- [wow.js](https://wowjs.uk/) and [Animate.css](https://animate.style/): CSS transition animations triggered on viewport entry
- [MaterialUI](https://material-ui.com/) and [Bulma](https://bulma.io/) for selected form inputs styling
- [Reset.css](https://meyerweb.com/eric/tools/css/reset/): a reset stylesheet to ensure cross-browser consistency of default styling
- [Github pages](https://pages.github.com/) and [gh-pages](https://github.com/tschaub/gh-pages): to easily deploy our React web app on Github pages

## Architecture

The composable nature of React components allows us to naturally separate our implementation in distinct modules. We make heavy use of [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html) which allow us to easily extend any other component with custom capabilities with chained function calls. We describe here the file structure of the project in the `app/src` root directory:

- `App.js`: The entry point of our React application. It declares the router of pages and augments its components.
- `Config.js`: Global configuration with lifecycle-aware hooks, which allows us to filter the displayed data.
- `animation`: React components and styles related to global animations, implemented as higher-order components.
- `components`: Reusable custom assets and layout (higher-order) components such as loading screens, menus, content view and sidebars.
- `pages`: React components for each page and visualization. They are described in greater detail in the following sections.
- `utils`: Reusable functions in the project

# Visualizations

## Histogram

**100 years of anime**

With this visualization, we want to showcase the huge amount of existing anime and the increase in volume of anime production over the years. For this visualization, we were inspired by the [Github contributions calendar](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/viewing-contributions-on-your-profile#contributions-calendar) but scaled up to the thousands of anime titles in the dataset. We represent each anime by a dot, which color shade is derived from its episode count. The user is able to hover over every dot of the visualization to preview details about an anime, and click on one to persist it in the sidebar.

We built it from scratch using only standard `div`s and React's state management. We fetch the data `history.json` and save it as state of the component once ready. Then, `render` is automatically triggered, and the histogram consists of multiple container `div`s of class `row` for each year, containing multiple `div`s of class `dot` for all anime produced during that year. Each `dot` is a circle which color is shaded given the following color scaling: `(maxShade - minShade) / (maxThreshold - minThreshold) * (episodeCount % maxThreshold) + minShade` given our shading function defined in `ColorUtils.shade`, with base color `#F59B00`. Each dot is registered an `onMouseEnter`, `onMouseLeave` and `onClick` listener to change its respective state in the sidebar, which will then display the selected anime details. We add CSS transition classes for additional animations when rows enter the viewport.

One tricky part in the implementation was to make sure that the scrollable zones of the sidebar always behaved correctly, given the fixed scale gradient in the bottom right corner. We were worried about the performance of the browser given so many event listeners, but the production build proved to be fast enough, although somewhat CPU intensive.

Histogram visualization: main                            | Histogram visualization: click on anime
:--------------------------------------------------:|:------------------------------------:
![Histogram visualization](assets/final_history_page.png){#id .class width=300px}  |![Histogram visualization pokemon](assets/final_history_page_pokemon.png){#id .class width=300px}

## Bubble chart

**43 genres to classify them all**

The goal was to show the distribution of genres across animes. Given the non-negligible number of genres, we thought a bubble chart would be a good fit as it quickly highlights the most represented genres and how they compare to each other.

From the main anime dataset, we were able to directly access the genres of each anime. Inspired by some [d3 example](https://observablehq.com/@d3/bubble-chart), we were able to generate the positions and radii for the bubbles.

To illustrate the genres, we decided to display the image of the anime with the most user favorites for each genre. However by doing so, if two genres share the same anime as most favorite, then they will also both show the same illustration. For instance, all genres listed by the most favorite anime title will share the same image. To prevent that behaviour, we select the image of a genre in decreasing order of its population by selecting an anime only if it has not yet been selected by another genre. Although each genre may hence not display its first most popular anime, we thus maximally increase the image diversity to avoid dull repetitions. Some of the image links were broken from the dataset, but given there were only a few of them, we manually replaced them.

We also wanted to give the ability for a user to filter the genres that are displayed. To do so, we implemented a dropdown list of toggle-able buttons, each corresponding to one genre. We also provide an `ALL` button and a `NONE` button to quickly show all the bubbles or unselect everything so that one can then precisely choose the bubbles he is interested in. Every time the genre selection changes, the bubble positions and radii are recomputed. The bubbles then smoothly transition by translation and scaling from their previous position to the new one.

Another feature we wanted to include is the display of the most popular animes for each genre on demand. In order to increase the interactivity of the visualization, we implemented the feature with a zoom into the selected bubble, so that it covers most of the screen. We then create another bubble chart inside consisting of the most popular animes for that genre. The user can then jump from one genre bubble to another by clicking on its neighboring genres. If there are animes that appear in both genres, they will also smoothly travel from the first genre to the other.  

A first implementation of this feature was to simply focus on the selected genre and scale every other bubble alongside proportionally. However, this proved to cause performance issues when selecting small genre bubbles as it would then scale the bigger genres to enormous sizes. The issue was almost unnoticable on Firefox but Chromium-based browsers had a hard time dealing with it. To address the issue, we simply push/offset the bubbles by the size of the bubble chart so that they lie close to the boundary and remain at the original size, instead of scaling them up. The difference between both implementations is shown below.

Bubble chart zoom: version 1                             | Bubble chart zoom: version 2 (final)
:--------------------------------------------------:|:------------------------------------:
![Bubble version 1](assets/bubble_zoom_version1.png){#id .class width=300px}  |![Bubble version 2](assets/bubble_zoom_version2.png){#id .class width=300px}

Finally, depending on the bubble that the user is hovering / clicking on, information about the respective chart / genre / anime is displayed in the sidebar.

![Bubble visualization](assets/final_bubble_page.png){#id .class width=260px}

\pagebreak

## Sankey diagram

**711 studios captivating the world**

For this diagram, the aim was to show information about the most consequential anime studios. A Sankey diagram allows us to highlight the affinity of a given studio to the genres of the animes it produces while simultaneously comparing them to their user ratings, which are sorted per score mean (rounded to the closest integer).

For this interactive diagram, we used the `amcharts` library, as documented [here](https://www.amcharts.com/docs/v4/chart-types/sankey-diagram/). Its rich API offers us many possibilities for representation, interaction and animation of the data out-of-the-box.

The main difficulty in this implementation was to show the connection between each group of links when hovering on it, as we want to increase the opacity on one hand of the link from a studio to a genre, and at the same time from that genre to all its attached ratings on the other. To do so, we use an identifier for each link which consists of the concatanation of the name of the studio (2 first letters and the last) with the genre name and a number which discriminates if the link connects to a genre or a rating (for instance, the link going from Toei Animation to Action will have its `id=TonAc-0` and for the same studio going to a note `id=TonAc-1`). Then we can extract the first part of the `id` to know if it belongs to the same group, and highlight all the other that share the same identifier when hovering on any of the associated links.

We arbitrarily chose the number of studios and genres present in the diagram, and stroke a balance between information density and performance. Indeed, each new node adds a sizable number of links, inherently affecting performance. After some testing, we settled on showing 10 studios (which have produced the biggest amount of anime titles) and 5 genres (which contain the most anime) to keep the diagram relevant.

Similarly to the other diagrams, we put additional information in the sidebar depending on what node is hovered, and show related information for each studio and a short description for each genre.

Sankey visualization: main                           | Sankey visualization: hover on studio
:--------------------------------------------------:|:------------------------------------:
![Sankey visualization](assets/final_sankey_page.png){#id .class width=300px}  |![Sankey visualization: toei](assets/final_sankey_page_toei.png){#id .class width=300px}

## Chord diagram

**11292 voices giving life to characters**

The last diagram is about the voice actors, their popularity and the social connectivity network that relates them to each other. Using a chord diagram seems intuitive, as we can easily represent each actor with a node and trace a link between any two of them if they played in the same anime or movie at least once. Again, we used the `amcharts` library with the its associated documentation [here](https://www.amcharts.com/docs/v4/chart-types/chord-diagram/).

A user can select the language in which voice actors dub in, which will update the displayed actors. We also added a dropdown menu to select the number of shown actors. They can be sorted either by the number of times they have been added as favorite by MyAnimeList users, or by their alphabetical order, with two buttons at the top of the diagram.

The main issue with this diagram laid in the script to fetch and sort the data, so that it takes into account all possible combinations of the dropdown menus. We had to fetch the data of every anime to find the actors per language and per character, to be then able to retrieve the information per actor using the Jikan API before sorting them. Then we took the top actors per language, and checked whether any two of them played in the same anime and combined all these information for each node and each link between pairs into a JSON file. Another file was generated for the sidebar which stores the information of each voice actor, combined with the selection of the top 3 characters they dubbed (depending on the popularity of the anime the character was in).

Then we added some additional interactive displays: first, a circle bullet with the number of anime/movies dubbed by each and shaded with the actor's popularity, as well as the possibility to highlight every actress or actor linked to the one hovered. Finally, we added the buttons to change how the diagram is sorted and the amount of actors and language we want to show. This is implemented through key-value pairs (for example `top 10 -> "English" -> data`) and sorting each value differently, as `amcharts` will create nodes depending on their appearance on the dataset.

Chord visualization: main                           | Chord visualization: hover on voice actor
:--------------------------------------------------:|:------------------------------------:
![Chord visualization](assets/final_chord_page.png){#id .class width=300px}  |![Chord visualization](assets/final_chord_page_dany.png){#id .class width=300px}


# Future work

The main issue with our visualizations is that most of them are not adapted to display correctly on mobile devices. Using responsive design technologies such as media queries, we could implement layouts that would adapt to the available space and pixel density.

Furthermore we only used a single dataset based on a website that is more popular in some countries than other, thus information is biased depending on the anime culture of each region. For example this dataset lists Poland and Brazil as having the top number of users while France is at the bottom, even though the latter is one of the top countries worldwide watching anime. We could combine additional datasets from other platforms: [Crunchyroll](https://www.crunchyroll.com/), [ADN](https://animedigitalnetwork.fr/) or [AniList](https://anilist.co/). However, using their datasets would have been more challenging and taken more time to scrupulously gather and merge.

Each of the visualizations could be further improved by adding specific features:

- Histogram:
    - Add an anime search bar so that the user can easily find the animes he is interested in.
    - Add a year range selector to only show the range of years the user i interested in.
    - Show the top anime per year or range of years.

- Bubble:
    - Add an anime search bar to only display the genres of the chosen anime.

- Sankey:
    - Add a list of studios and genres to choose from, so that a user can select which of them appear on the diagram.

- Chord:
  - Adding a minimal threshold on the number of anime played in by two seiyuus for them to be linked together, as the graphs we have are rather strongly connected depending on the selected language. Another variant could be to change the width of the link depending on this same number of common animes.

We could add more diagrams such as world map of users (the dataset was unfortunately too biased and imprecise), or the evolution of the popularity / studios / genres of animes through time.

# Peer assessement

Each member mainly worked on its visualization(s) and the necessary data processing. We all contributed in the general visualization ideas and decisions that lead to the final website result.

Alexandre Chau:

- Web app setup, global structure, layout, styles and animations
- Histogram (data processing and visualization)
- Helped integrate elements in the React ecosystem 
- Website design

Joachim Dunant:

- Chord diagram (data processing, visualization and animations)
- Sankey diagram (data processing, visualization and animations)
- Website design

Pedro Torres Da Cunha:

- Bubble chart (data processing, visualization and animations)
- Helped with data processing (pandas)
- Website design

# Conclusion

In this project we worked on different visualizations about anime and their particularities, to showcase their evolution through time with a histogram, how they relate to each other with a genres bubble diagram, and the people and companies behind their production with a sankey chart and a chord diagram. We opted for a web application which renders a page for each visualization rather than a single linear page. The implementation was realized with modern web technologies including ReactJS, Babel, Webpack, SASS and visualization libraries D3 and amCharts as well as custom barebone JS components.

We hope that users can explore and experiment with the different visualizations with an overall fun, elegant and engaging experience that provides them with visual insights about the animation industry.