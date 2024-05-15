const inputEl = document.getElementById("search-movie-input")
const formEl = document.querySelector("form")
const movieContainer = document.querySelector(".movie-container")
const watchlistContainer = document.querySelector("#watchlist-container")
let moviesArr = []
let myWatchlist = []

async function getMovieDetails(movies) {
    moviesArr = []
    for (let movie of movies) {
        if (!moviesArr.some(m => m.Title === movie.Title)) {
            await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=36cef097&t=${movie.Title}`)
                .then(res => res.json())
                .then(data => {
                    moviesArr.push(data)
                })
        }
    }
    renderMovie()
}

function renderMovie() {
    let html = ""
    for (let movie of moviesArr) {
        html += `<div class="movie-card">
            <img src="${movie.Poster}" alt="Movposter" class="poster-img">
            <div>
                <h3>${movie.Title} <span class="star-span-el"><img src="images/start-Icon.png" alt="Star icon">
                ${movie.imdbRating}</span></h3>
                <div class="movie-subdetails">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <div> 
                        <img src="images/Icon.png" alt="Add to watchlist button" class="add-to-watchlist"  data-movieId=${movie.imdbID}>
                        <p data-movieId=${movie.imdbID}>Watchlist</p>
                    </div>
                </div>
                <p class="plot">${movie.Plot}</p>
            </div>
        </div>
    `
    }
    movieContainer.innerHTML = html
}

function addToWatchlist(id) {
    for (let movie of moviesArr) {
        if (movie.imdbID === id) {
            if (!myWatchlist.some(m => m.Title === movie.Title)) {
                myWatchlist.push(movie)
                updateWatchlistStorage()
            } else {
                alert("Already in your watchlist")
            }
        }
    }
}

function removeFromWatchlist(id) {
    const indexToRemove = myWatchlist.findIndex(movie => movie.imdbID === id);
    if (indexToRemove !== -1) {
        myWatchlist.splice(indexToRemove, 1);
        updateWatchlistStorage();
        renderWatchlist()
    }
}

function updateWatchlistStorage() {
    localStorage.setItem("watchlist", JSON.stringify(myWatchlist))
}

function renderWatchlist() {
    let html = ""
    myWatchlist.forEach(movie => {
        html += `
        <div class="movie-card">
            <img src="${movie.Poster}" alt="Movie poster" class="poster-img">
            <div>
                <h3>${movie.Title} <span class="star-span-el"><img src="images/start-Icon.png" alt="Star icon">
                ${movie.imdbRating}</span></h3>
                <div class="movie-subdetails">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <div> <img src="images/remove-Icon.png" alt="Add to watchlist button"
                            class="add-to-watchlist" data-remove=${movie.imdbID}>
                        <p data-remove="${movie.imdbID}">Remove</p>
                    </div>
                </div>
                <p class="plot">${movie.Plot}</p>
            </div>
        </div>
        `
    })
    if (watchlistContainer) {
        watchlistContainer.innerHTML = html
    }
}

if (formEl) {
    formEl.addEventListener("submit", (e) => {
        e.preventDefault()
        const movieName = inputEl.value
        fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=36cef097&s=${movieName}`)
            .then(res => res.json())
            .then(data => {
                getMovieDetails(data.Search);
            })
    })
}

movieContainer.addEventListener("click", (e) => {
    if (e.target.dataset.movieid) {
        addToWatchlist(e.target.dataset.movieid)
    }
})

if (watchlistContainer) {
    watchlistContainer.addEventListener("click", (e) => {
        if (e.target.dataset.remove) {
            removeFromWatchlist(e.target.dataset.remove)
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const storedWatchlist = localStorage.getItem("watchlist");
    if (storedWatchlist) {
        myWatchlist = JSON.parse(storedWatchlist);
        renderWatchlist();
    }
});