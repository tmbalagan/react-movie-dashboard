import './App.css';
import { useState } from 'react';
import movieJson from './movies.json'
import keyMapJson from './key-map.json'
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

    var filteredMovies = []
    var groupTitleWise = {}
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
    //  The rankMovieList function gets the value of the user's selection from the dropdown list to filter movies from the query.

    // query always title and rank
    const filteredMovies = movieJson.filter((movie) => {
      var title = movie["Title"]

      // check if the title is present in the movie and add the rank value to it.
      if (query[title]) {
        movie["Rank"] = query[title]['Rank']
        return true
      }
    }).sort((a, b) => {
      // Sort movies by rank
      return a.Rank - b.Rank
    })

    // Set movies from filteredMovies
    setMovieList(filteredMovies)
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
          if (key != undefined && value != undefined) {
            if (key == "title")
              // movie key mapping and replace single to double quotes
              var object = { [keyMapJson[key]]: (value).replace(/'/g, "") }
            else
              object[keyMapJson[key]] = value

            if (object.Title && object.Rank) {
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
        <select value={value} onChange={handleSelect} className="filter-box">
          <option value="get">GET</option>
          <option value="rank">Rank</option>
        </select>
        <input placeholder='Enter your query' className='filter-box query-input-box' value={query} onChange={handleSearch} onKeyDown={handleKeyDown} />
      </section>
      <section className='list-movies'>
        {movies.map((movie) => (
          <div className='card' key={movie.Title}>
            <figure className='card-figure'>
              <img src={movie.Poster} width="210" height="315" loading='lazy' alt={movie.Title} />
              <figcaption className='card-caption'>{movie.Title}, {movie.Year}</figcaption>
            </figure>
          </div>
        ))}
        {movies.length == 0 && <p>Could not matching for given criteria, Please modify your search</p>}
      </section>
    </div>
  );
}

export default App;
