

const MovieList = ({ movies }) => {
    return (
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
    )
}


export default MovieList;
