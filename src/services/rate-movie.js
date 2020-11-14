import MovieApi from './movie-api';
import MoviesData from './movies-data';
import SessionData from './session-data';

export default class RateMovie {
    movieApi = new MovieApi();

    moviesData = new MoviesData();

    sessionData = new SessionData ();

    postRateMovie (movieId, rateValue, sessionId) {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({"value": rateValue })
        }

        return this.movieApi.getResource(`movie/${movieId}/rating`, `guest_session_id=${sessionId}`, options);
    };

    getRateMovies (currentPage, sessionId) {
        return this.movieApi.getResource(`guest_session/${sessionId}/rated/movies`, 'language=en-US&sort_by=created_at.asc')
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
        return this.movieApi.getResource(`movie/${movieId}/account_states`, `guest_session_id=${sessionId}`);
    };
};