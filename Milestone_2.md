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

**Bold if it is core**  
*Italic if it is "would be nice"*

- **Time diagram :**
  - **horizontal slider**
  - **Showcase of the top 10 animes per year (or another time period)**
  - Each time period corresponds to either:
    - a column
    - a page
    - something else
  - how it is displayed for columns: 
    - show the selected year as 60% of the width and the ones next to it as 20%.
    - the non-selected years get compressed on the sides.
    - a mix of the two
  - *Give the possibility to choose the time period :*
    - *select between 1 month, 3 months, 6 months, 1 year, 5 years.*

- **Bubble Diagram by genre :**
  - **Size = Sum of popularity of all animes within the genre** *+ interaction between that and :*
    - *Gender share*
    - *Mean score*
  - **Highlighting a genre shows ~top 20 most popular anime**
  - *We can search for an anime (with autocompletion) to show it in its genres*
  - **We can search for a genre to highlight it**
  - **A small disk inside the bubble has a color representing the gender share**

- **Sankey Diagram :**
  -  **3 columns :**
     - **1) Studio (~ ten most populars)**
     - **2) Genre (~ ten most populars)**
     - **3) Score (round to .5)**
   - **Can click on a studio to show his own Sankey proportions**
   - **Same with genre by studio**
   - *Can individually select studios and genres that show in the diagram*
  
- **Chord Diagram :**
  - **Links voice actors playing in the same anime**
  - **Highlighting one actor shows his/her personal informations**
  - *We can switch between* **different colors, depending of :**
    - **genre**
    - *label*
  - **Sort by color** *then Number of animes they dubbed in.*
  - *Different ways of showing this number :*
    - *Number inside the 'rectangle'*
    - *Lines to separate groups of same numbers*
    - *Circle arcs to separate groups of same number*

- *Interactive worldwide heatmap :*
  - **Shows popularity of specific genre over the world.**
  - *Shows popularity of specific anime over the world.*
  
- *Stacked Area Chart :*
  - Evolution of **genre** / **country** / *studio* / *anime* popularity through time.
  - **The values will be limited to the ~10 most representative**
  - *User has the option to switch into showing the popularity of the studio or country instead.*