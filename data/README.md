# Data processing

This folder contains the data processing script for the Anime Data Visualization. Each script is a Python Jupyter notebook and will output a JSON file once ran, which can be manually tweaked for formatting. Final JSON files used by the data visualization app are placed in absolute folder [/app/public/data](../app/public/data).

### Prerequisites

To run the scripts you will need:

- Python 3 ([link](https://www.python.org/download/releases/3.0/)): scripting and programming runtime and environment
- Jupyter Notebook ([link](https://jupyter.org/)): web-based development application for interactive Python scripts
- Pandas ([link](https://pandas.pydata.org/)): data analysis library for Python
- JikanPy ([link](https://github.com/abhinavk99/jikanpy)): Python wrapper library around the [Jikan API](https://jikan.moe/)
- The original dataset CSVs which can be found [here](https://www.kaggle.com/azathoth42/myanimelist), placed in relative folder `./raw` (you may need to create it)

Each `.ipynb` can be opened in your local Jupyter Notebook instance as a standalone script.

### Scripts description

- `Genres.ipynb`: takes as input `raw/anime_cleaned.csv` and produces `genre_data.json` and `genre_top_animes_data.json`, containing the data for the genres bubble diagram.

- `History.ipynb`: takes as input `raw/AnimeList.csv` and produces `history.json`, containing the data for the histogram

- `Actors.ipynb`: takes as input `raw/anime_cleaned.csv` and fetches data from the Jikan API. It outputs `vA_datasets.json` and `vA_infos.json` (the latter is to be placed in [/app/src/pages/chord](/app/src/pages/chord) for bundling) which contain the data for the actors chord diagram.

- `Studios.ipynb`: takes as input `raw/anime_cleaned.csv` and produces `sankey_dataset.json` which contains the data for the studios sankey diagram.