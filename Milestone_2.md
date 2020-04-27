# Milestone 2

## Summary

### Code

- React
- d3

### Website architecture

- Pages with one graph per page
- Each page corresponds to one main visualization/mini story
- Smooth transitions from one page to another
- Table of content / tabs

### Graphs

- **Time diagram**
    - slider
    - Showcase of the top 10 animes per year (or per 6 month)
    - 

- **Bubble Diagram by genre :**
  - Size = sum of popularity of all animes within the genre
  - Highlighting a genre shows ~top 20 most popular anime
  - We can search for an anime (with autocompletion) to show it in its genres
  - We can search for a genre to highlight it
  - The color of the bubble represents the gender share

- **Interactive worldwide heatmap :**
  - Shows popularity of specific genre over the world.
  - Shows popularity of specific anime over the world.

- Sankey Diagram :
  -  **3 columns :**
     - **Studio (~ ten most populars)**
     - **Genre (~ ten most populars)**
     - **Score (round to .5)**
   - **Can click on a studio to show his own Sankey proportions**
   - **Same with genre by studio**
   - *Can individually select studios and genres that show in the diagram*
  
- Stacked Area Chart :
  - Evolution of **genre** / **country** / *studio* / *anime* popularity through time.
  - The values will be limited to the 10 most representative
  - _User has the option to switch into showing the popularity of the studio or country instead._
  
- **Chord Diagram :**
  - Links voice actors playing in the same anime
  - Highlighting one actor shows his/her personal informations
  - Different colors depending of :
    - genre
    - label
  - Sort by color -> Number of animes they dubbed in
  - Different ways of showing this number :
    - Number inside the 'rectangle'
    - Lines to separate groups of same numbers
    - Circle arcs to separate groups of same number