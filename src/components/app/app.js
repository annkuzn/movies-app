import React, { Component } from 'react';
import { Tabs, Spin, Pagination } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../../context';
import MoviesList from '../moviesList/moviesList';
import SearchInput from '../searchInput/searchInput';
import MovieApi from '../../services/movie-api';

const { TabPane } = Tabs;

export default class App extends Component {

    movieApi = new MovieApi();

    state = {
        tab: 1,
        request: null,
        genres: null,
        error: false,
        loading: false, 
        ratedMovies: [],
        searchMovies: [],
        currentPage: 1,
        totalPages: 1,
    };

    componentDidMount() {   
        this.movieApi.getSessionId();   

        this.movieApi.getGenres()
        .then(res => {
            this.setState({genres: res.genres});
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage } = this.state;

        if (prevState.request !== request || prevState.currentPage !== currentPage) {
            this.changeLoading(true);

            const curPage = prevState.request === request ? currentPage : 1;

            if (request) {
                this.movieApi.getMovies(request, curPage)
                .then(([ movies, pages ])=> {
                    this.setState({
                        error: false,
                        loading: false,
                        searchMovies: movies,
                        currentPage: curPage,
                        totalPages: pages,
                    });
                })
                .catch(err => this.onError(err.message));
            } else {
                this.changeLoading(false);
            };
        };
    };

    componentDidCatch(err){
        this.onError(err.message);
    };

    changeLoading = (load) => {
        this.setState({loading: load});
    };
 
    onError = (message) => {
        this.setState({
            error: message,
            loading: false
        });
    };

    changePage = (page) => {
        this.setState({currentPage: page});
    };    

    updateRequest = (newRequest) => {
        this.setState({request: newRequest.target.value.trim()});
    };

    pushRatedMovie = (movie) => {
        const { ratedMovies } = this.state;

        let newMovie = true;

        const newRatedMovies = ratedMovies.map(item => {
            if (item.id === movie.id) {
                newMovie = false;
                return movie;
            }
            return item;
        });

        this.setState({ratedMovies: newMovie ? [...newRatedMovies, movie] : newRatedMovies});
    };

    updateSearchTab = (tabKey) => {
        const numberTab = +tabKey;

        this.setState({
            tab: numberTab,
            error: false
        });
    };
 
    tabClickHandler = (tabKey) => {
        this.updateSearchTab(tabKey);
    };

    paginationChangeHandler = (page) => {
        this.changePage(page);
    };

    render () {
        const { tab, genres, error, loading, ratedMovies, searchMovies, currentPage, totalPages } = this.state;

        const pagination = (tab === 1 && !loading && !error) ? (
            <Pagination
                hideOnSinglePage
                total={totalPages}
                defaultPageSize={20}
                current={currentPage}
                showSizeChanger={false}
                onChange={this.paginationChangeHandler}
            />
        ) : null;

        const loader = loading ? <Spin className="spin" size="large" /> : null;
        const input = tab === 1 ? <SearchInput updateRequest={this.updateRequest}/> : null;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" />
                    <TabPane tab="Rated" key="2" />
                </Tabs>
                {input}
                {loader}
                <MoviesList
                    tab={tab}
                    error={error}
                    loading={loading}
                    ratedMovies={ratedMovies}
                    searchMovies={searchMovies}
                    pushRatedMovie={this.pushRatedMovie}
                />
                {pagination}
            </Provider>
        );
    };
};