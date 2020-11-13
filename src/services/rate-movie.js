import MovieApi from './movie-api';
import MoviesData from './movies-data';
import SessionData from './session-data';

export default class RateMovie {
    movieApi = new MovieApi();

    moviesData = new MoviesData();

    sessionData = new SessionData ();

    postRateMovie (movieId, rateValue, sessionId) {
        return fetch(`${this.movieApi.apiBase}movie/${movieId}/rating?api_key=${this.movieApi.apiKey}&guest_session_id=${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({"value": rateValue })
        });
    };

    getRateMovies (currentPage, sessionId) {
        
        return fetch(`${this.movieApi.apiBase}guest_session/${sessionId}/rated/movies?api_key=${this.movieApi.apiKey}&language=en-US&sort_by=created_at.asc`)
        .then(res => res.json())
        .then(res => {
            const moviesArr = res.results;

            if (!moviesArr.length) {
                throw new Error(`Пока нет оцененных фильмов`);
            }

            return moviesArr;
        })
        .then(movies => {
            const moviesPages = this.moviesData.processingMoviesArr(movies);
            
            return [moviesPages, movies.length, currentPage];
        })
    };

    getRateMovie(movieId, sessionId) {
        
        return fetch(`${this.movieApi.apiBase}movie/${movieId}/account_states?api_key=${this.movieApi.apiKey}&guest_session_id=${sessionId}`)
        .then(res => res.json())
    };
};