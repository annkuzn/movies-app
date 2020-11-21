
export default class MovieApi {
    apiBase = 'https://api.themoviedb.org/3/';

    apiKey = '88a91ac04dba011fd615caf2589ff8fb';

    sessionId = null;

    async getResource(url, request, options) {
       
        const res = await fetch(`${this.apiBase}${url}?api_key=${this.apiKey}&${request}`, options);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        };

        return res.json();
    };

    getMovies(currentPage, prevRequest, request) {
        return this.getResource('search/movie', `query=${request}&page=${currentPage}`)
        .then(res => {
            const moviesArr = res.results;
            if (!moviesArr.length) {
                throw new Error(`Нет результатов по запросу "${request}"`);
            }
            return [moviesArr, res.total_results];
        })
        .then(([movies, totalPages]) => {

            const curPage = prevRequest === request ? currentPage : 1;

            return [movies, totalPages, curPage];
        })
    };

    getGenres() {
        return this.getResource('genre/movie/list', 'language=en-US');
    };

    postRateMovie (movieId, rateValue, sessionId) {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({"value": rateValue })
        }

        return this.getResource(`movie/${movieId}/rating`, `guest_session_id=${sessionId}`, options);
    };

    getRateMovies (sessionId) {
        return this.getResource(`guest_session/${sessionId}/rated/movies`, 'language=en-US&sort_by=created_at.asc')
        .then(res => {
            const moviesArr = res.results;

            if (!moviesArr.length) {
                throw new Error(`Пока нет оцененных фильмов`);
            }

            return [moviesArr];
        })
    };

    getRateMovie(movieId, sessionId) {
        return this.getResource(`movie/${movieId}/account_states`, `guest_session_id=${sessionId}`);
    };

    getSessionId() {
        return this.getResource('authentication/guest_session/new')
        .then( res => {
            return res.guest_session_id;
        })
        .then( id => {
            this.sessionId = id;
            return id;
        });
    };
}