import MovieApi from './movie-api';

export default class MoviesData {

    movieApi = new MovieApi();
    
    getMovies(currentPage, prevRequest, request) {
        return this.movieApi.getResource('search/movie', `query=${request}&page=${currentPage}`)
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
    }

    getGenres() {
        return this.movieApi.getResource('genre/movie/list', 'language=en-US');
    };
};