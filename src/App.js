import './App.css';
import { useState } from 'react';
import movieJson from './movies.json'
import keyMapJson from './key-map.json'
import MovieList from './components/MovieList'
import SelectComponent from './components/SelectComponent'
import SearchInput from './components/SearchInput';

function App() {
  const [movies, setMovieList] = useState(movieJson)
  const [value, setValue] = useState("get")
  const [query, setQuery] = useState("")


  const handleSelect = (e) => {
    // The handleSelect function is called when the user selects a value from the dropdown menu.

    if (value != e.target.value) {
      // Set the movieList to the movieJson object.
      setMovieList(movieJson)
      setQuery("")
    }
    // Set the value of the dropdown menu to the value that the user selected.
    setValue(e.target.value);
  };

  const handleSearch = (e) => {
    // The handleSearch function is called when the user type in input box
    setQuery(e.target.value)
  }

  const filterMovieList = (query = {}) => {
    //  The filterMovieList function gets the value of the user's selection from the dropdown list to filter movies from the query.

    let filteredMovies = []
    let groupTitleWise = {}
    movieJson.map((movie) => {
      for (const key in query) {
        if (query[key] != undefined && movie[key] != undefined) {
          // to avoid uppercase issue, convert both query and movie into lowercase
          const lowerCaseQuery = query[key].toLowerCase();
          const lowerCaseMovieValue = movie[key].toString().toLowerCase();
          if (lowerCaseMovieValue.includes(lowerCaseQuery)) {
            groupTitleWise[movie["Title"]] = movie
          }
        }
      }
    });

    //  Group movies by title to remove duplicate entries.
    for (const movie in groupTitleWise) {
      filteredMovies.push(groupTitleWise[movie])
    }
    // Set movies from filteredMovies
    setMovieList(filteredMovies)
  }

  const rankMovieList = (query = {}) => {
    let groupNotRankingMovies = []
    let defaultMovieRanking = []
    let combineArray = []
    //  The rankMovieList function gets the value of the user's selection from the dropdown list to filter movies from the query.

    // query always title and rank
    for (let i = 1; i <= movieJson.length; i++) {
      defaultMovieRanking.push(i)
    }

    let queryWiseRankedMovies = movieJson.filter((movie) => {
      let title = movie["Title"]

      // check if the title is present in the movie and add the rank value to it.
      if (query[title]) {
        movie["Rank"] = parseInt(query[title]['Rank'])
        // filter is used to remove ranks that are present in the "defaultMovieRanking" array. This is used to assign movies that have not been ranked.
        defaultMovieRanking = defaultMovieRanking.filter(function (rank) {
          return rank !== movie["Rank"]
        })
        return true
      } else {
        groupNotRankingMovies.push(movie)
      }
    })

    // Assign the values of the "defaultMovieRanking" array, not the movie ranking
    groupNotRankingMovies = groupNotRankingMovies.filter((movie, index) => {
      movie["Rank"] = defaultMovieRanking[index]
      return true
    })

    // Combine user ranking and custom ranking
    combineArray = [...groupNotRankingMovies, ...queryWiseRankedMovies].sort((a, b) => {
      // Sort movies by rank
      return a.Rank - b.Rank
    })

    setMovieList(combineArray)
  }

  const handleKeyDown = (e) => {
    // The function handleKeyDown is called when the user presses enter in the input box.

    let search = e.target.value
    if (e.key === 'Enter' && search.length > 0) {
      // dropdown value "get" and "rank" it by condition.

      if (value == "get") {
        search = search.replaceAll(",", "&");
        // https://medium.com/swlh/urlsearchparams-in-javascript-df524f705317
        const urlParams = new URLSearchParams(search)
        const params = {}
        for (const [key, value] of urlParams.entries()) {
          // movie key mapping
          if (keyMapJson[key] != undefined) {
            params[keyMapJson[key]] = value
          }
        }
        // Pass the constructed params object
        filterMovieList(params)

      } else {
        const titleRankPairs = query.split("&");
        const params = {};

        for (const titleRankPair of titleRankPairs) {
          const [key, value] = titleRankPair.split("=");
          if ((key != undefined && value != undefined) && keyMapJson[key]) {
            if (key == "title") {
              // movie key mapping and replace single to double quotes
              var object = { [keyMapJson[key]]: (value).replace(/'/g, "") }
            } else if (key == "rank") {
              object[keyMapJson[key]] = value
            }

            if (object && object.Title && object.Rank) {
              // Group title and rank
              params[object["Title"]] = object
            }
          }
        }

        // Pass the constructed params object
        rankMovieList(params)
      }
    } else if (search.length == 0) {
      // If the search value is empty, display all data.
      setMovieList(movieJson)
    }
  }

  return (
    <div className="container">
      <section className='filter-section'>
        <SelectComponent value={value} handleSelect={handleSelect} />
        <SearchInput value={query} handleSearch={handleSearch} handleKeyDown={handleKeyDown} />
      </section>
      <MovieList movies={movies} />
    </div>
  );
}

export default App;
