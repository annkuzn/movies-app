

export default class MoviesData {

    apiBase = 'https://api.themoviedb.org/3/';

    apiKey = '88a91ac04dba011fd615caf2589ff8fb';

    async getResource(url, query, page) {
       
        const res = await fetch(`${this.apiBase}${url}?api_key=${this.apiKey}&query=${query}&page=${page}`);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        }

        return res.json();
    }
    
    getMovies(query, page) {
        return this.getResource('search/movie', query, page)
        .then(res => {
            const moviesArr = res.results;
            if (!moviesArr.length) {
                throw new Error(`Нет результатов по запросу "${query}"`);
            }

            return moviesArr;
        });
    }
}