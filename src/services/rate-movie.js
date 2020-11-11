import MovieApi from './movie-api';
import RequestToken from './request-token';

export default class RateMovie {
    movieApi = new MovieApi();

    requestToken = new RequestToken ();

    sessionId = localStorage.session_id;

    postRateMovie (movieId, rateValue) {
        return fetch(`${this.movieApi.apiBase}movie/${movieId}/rating?api_key=${this.movieApi.apiKey}&session_id=${this.sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({"value": rateValue })
        })
    }

    getRateMovies (currentPage) {
        const accauntId = this.requestToken.getAccauntId(this.sessionId);
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
            const numberOfMoviesPerPage = 6;
            const numberOfFullPages = Math.round(movies.length / numberOfMoviesPerPage);
            const numberOfPages = movies.length % numberOfMoviesPerPage ?  numberOfFullPages + 1 : numberOfFullPages;

            // eslint-disable-next-line no-shadow
            let page = 1;

            const moviesPages = movies.reduce((acc, movie) => {
                if (Object.keys(acc).length <= numberOfPages) {

                    if (!acc[page]) {
                        acc[page] = [movie];
                    } else if (acc[page].length < numberOfMoviesPerPage) {
                        acc[page] = [...acc[page], movie];
                    }

                    if (acc[page].length === numberOfMoviesPerPage) {
                        page += 1;
                    }
                }
                return acc;
            }, {});
            return [moviesPages, movies.length, currentPage];
        })
    }

    getRateMovie(movieId) {
        return fetch(`${this.movieApi.apiBase}movie/${movieId}/account_states?api_key=${this.movieApi.apiKey}&session_id=${this.sessionId}`)
        .then(res => res.json())
    }
}