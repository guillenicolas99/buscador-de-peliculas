import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import getMovies from './services/getMovies'
import { filterBy, sortBy } from './types/Types'
import Card from './components/Card'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [filtering, setFiltering] = useState(filterBy.NONE)
  const [sorting, setSorting] = useState(sortBy.NONE)
  const [search, setSearch] = useState('')
  const isFirstSearch = useRef(true)

  useEffect(() => {
    if (isFirstSearch.current) return
    setLoading(true)
    getMovies(search)
      .then(movie => {
        if (movie.Error === 'Movie not found!') {
          setError(true)
          setMessage(movie.Error)
          return
        }
        setMovies(movie.Search)
        setError(false)
        setMessage('Resultados de la búsqueda de: ' + search)
      })
      .finally(() => setLoading(false))
  }, [search])


  const changeFilter = (value) => {
    setFiltering(value)
  }

  const filterdMovies = useMemo(() => {
    if (filtering === filterBy.NONE) return movies
    if (filtering === filterBy.MOVIES)
      return movies.filter(movie => movie.Type.toLowerCase().includes(filterBy.MOVIES.toLowerCase()))
    if (filtering === filterBy.SERIES) {
      return movies.filter(movie => movie.Type.toLowerCase().includes(filterBy.SERIES.toLowerCase()))
    }
  }, [movies, filtering])

  const changeSort = (value) => setSorting(value)

  const sortedMovies = useMemo(() => {
    if (sorting === sortBy.NONE) return filterdMovies
    if (sorting === sortBy.ANNIO) {
      return filterdMovies.toSorted((a, b) => a.Year - b.Year)
    }
    if (sorting === sortBy.TITULO) {
      return filterdMovies.toSorted((a, b) => a.Title.localeCompare(b.Title))
    }
  }, [filterdMovies, sorting])

  const handleSubmit = (e) => {
    e.preventDefault()
    const { movieName } = Object.fromEntries(new window.FormData(e.target))
    if (!isFirstSearch.current === search) return
    setFiltering(filterBy.NONE)
    setSorting(sortBy.NONE)
    setSearch(movieName)
    isFirstSearch.current = false
  }

  return (
    <>
      <header>
        <select onChange={(e) => changeFilter(e.target.value)}>
          <option defaultValue={filterBy.NONE} value={filterBy.NONE}>Filter</option>
          <option value={filterBy.MOVIES}>filter by {filterBy.MOVIES}</option>
          <option value={filterBy.SERIES}>Sort by {filterBy.SERIES}</option>
        </select>
        <select onChange={e => changeSort(e.target.value)}>
          <option defaultValue={filterBy.NONE} value={sortBy.NONE}>Sort</option>
          <option value={sortBy.ANNIO}>{sortBy.ANNIO}</option>
          <option value={sortBy.TITULO}>{sortBy.TITULO}</option>
        </select>
        <form onSubmit={handleSubmit}>
          <input placeholder="Avengers, Spider-Man, Titanic" name='movieName' required />
          <button>Buscar</button>
        </form>
      </header>
      <main>
        <section>
          {
            isFirstSearch.current && !loading
              ? <h1>Busca una pelicula</h1>
              : loading
                ? <h1>LOADING...</h1>
                : sortedMovies.length === 0 || error
                  ? <h1>{message}</h1>
                  : <>
                    <h2>{message}</h2>
                    <Card key={movies.imdbID} movies={sortedMovies} message={message} />
                  </>
          }
        </section>
      </main>
    </>
  )
}

export default App
