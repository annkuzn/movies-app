

export default class MoviesData {

    apiBase = 'https://api.themoviedb.org/3/';

    apiKey = '88a91ac04dba011fd615caf2589ff8fb';

    async getResource(url, query) {
       
        const res = await fetch(`${this.apiBase}${url}?api_key=${this.apiKey}&query=${query}`);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`);
        }

        return res.json();
    }
    
    getMovies(prevRequest, query, currentPage) {
        return this.getResource('search/movie', query)
        .then(res => {
            const moviesArr = res.results;
            if (!moviesArr.length) {
                throw new Error(`Нет результатов по запросу "${query}"`);
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

            const curPage = prevRequest !== query ? 1 : currentPage;

            return [moviesPages, movies.length, curPage];
        })
    }
}