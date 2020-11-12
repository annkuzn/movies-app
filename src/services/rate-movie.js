import MovieApi from './movie-api';
import MoviesData from './movies-data';
import SessionData from './session-data';

export default class RateMovie {
    movieApi = new MovieApi();

    moviesData = new MoviesData();

    sessionData = new SessionData ();

    sessionId = localStorage.session_id;

    postRateMovie (movieId, rateValue) {
        return fetch(`${this.movieApi.apiBase}movie/${movieId}/rating?api_key=${this.movieApi.apiKey}&session_id=${this.sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({"value": rateValue })
        });
    };

    getRateMovies (currentPage) {
        const accauntId = this.sessionData.getAccauntId(this.sessionId);

        return fetch(`${this.movieApi.apiBase}account/${accauntId}/rated/movies?api_key=${this.movieApi.apiKey}&language=en-US&session_id=${this.sessionId}&sort_by=created_at.asc`)
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
        });
    };

    getRateMovie(movieId) {
        return fetch(`${this.movieApi.apiBase}movie/${movieId}/account_states?api_key=${this.movieApi.apiKey}&session_id=${this.sessionId}`)
        .then(res => res.json());
    };
};