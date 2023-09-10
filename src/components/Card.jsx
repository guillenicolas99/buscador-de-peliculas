export default function Card({ movies }) {
    return (
        <section className='cards-container'>
            {
                movies.map(movie =>
                    <article key={movie.imdbID}>
                        <img src={movie.Poster} alt={movie.Title} />
                        <h3>{movie.Title}</h3>
                        <h4>{movie.Year} - {movie.Type}</h4>
                    </article>
                )
            }
        </section>
    )
}