
export default async function getMovies (Search) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=4778cae2&s=${Search}`);
    if (!res.ok) throw new Error("Movie not found!");
    const response = await res.json();
    return response || [];
}