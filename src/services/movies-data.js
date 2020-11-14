import MovieApi from './movie-api';

export default class MoviesData {

    movieApi = new MovieApi();

    processingMoviesArr(movies) {
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

        return moviesPages;
    }
    
    getMovies(currentPage, prevRequest, query) {

        return this.movieApi.getResource('search/movie', `query=${query}`)
        .then(res => {
            const moviesArr = res.results;
            if (!moviesArr.length) {
                throw new Error(`Нет результатов по запросу "${query}"`);
            }
            return moviesArr;
        })
        .then(movies => {
            const moviesPages =this.processingMoviesArr(movies);

            const curPage = prevRequest !== query ? 1 : currentPage;

            return [moviesPages, movies.length, curPage];
        })
    }

    getGenres() {
        return this.movieApi.getResource('genre/movie/list', 'language=en-US');
    };
};