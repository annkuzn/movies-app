
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

    getMovies(request, currentPage) {
        return  this.getResource('search/movie', `query=${request}&page=${currentPage}`)
                .then(res => {
                    const moviesArr = res.results;
                    
                    if (!moviesArr.length) {
                        throw new Error(`Нет результатов по запросу "${request}"`);
                    };

                    return [moviesArr, res.total_results];
                });
    };

    getGenres() {
        return this.getResource('genre/movie/list', 'language=en-US');
    };

    getSessionId() {
        return  this.getResource('authentication/guest_session/new')
                .then( res => {
                    return res.guest_session_id;
                })
                .then( id => {
                    this.sessionId = id;
                    return id;
                });
    };
};