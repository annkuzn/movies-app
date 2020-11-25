import React, { Component } from 'react';
import { Tabs, Spin, Alert } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../../context';
import Section from '../section/section';
import Pagination from '../pagination/pagination';
import SearchInput from '../searchInput/searchInput';
import MovieApi from '../../services/movie-api';

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

    timer = null;

    componentDidMount() {   
        this.movieApi.getSessionId();   

        this.movieApi.getGenres()
        .then(res => {
            this.setState({genres: res.genres});
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { tab, request, ratedMovies, currentPage } = this.state;

        if (prevState.tab !== tab || prevState.request !== request || prevState.currentPage !== currentPage) {
            this.changeLoading(true);

            if (tab === 1) {
                this.onError(false);

                if (request) {
                    const func = this.movieApi.getMovies(currentPage, prevState.request, request);

                    this.searchMovies(func);
                } else {
                    this.changeLoading(false);
                };
            } else if (tab === 2) {
                this.changeLoading(false);

                if (!ratedMovies.length) this.onError('Пока нет оцененных фильмов');
            };
        };
    };

    componentDidCatch(err){
        this.onError(err.message);
    };

    changeLoading = (load) => {
        this.setState({loading: load});
    };

    searchMovies = (func) => {
        const { currentPage } = this.state;

        func.then(([ movies, pages, curPage ])=> {
            this.setState({
                error: false,
                loading: false,
                searchMovies: movies,
                currentPage: curPage || currentPage,
                totalPages: pages,
            });
        })
        .catch(err => this.onError(err.message)); 
    };
 
    onError = (message) => {
        this.setState({error: message});
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

        const newArr = ratedMovies.map(mov => {
            if (mov.id === movie.id) {
                newMovie = false;

                return {...mov, rating: movie.rating};
            };

            return mov;
        })

        this.setState({ratedMovies: newMovie ? [...newArr, movie] : [...newArr]});
    };

    updateSearchTab = (tabKey) => {
        const numberTab = +tabKey;

        this.setState({
            tab: numberTab,
            loading: true,
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
        const { TabPane } = Tabs;

        const searchInput = <SearchInput updateRequest={this.updateRequest} />;

        const paginationSearchMovies = <Pagination
                                            defaultPageSize={20}
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            paginationChangeHandler={this.paginationChangeHandler}
                                        />
        
        const spinner = <div className="spin">
                            <Spin size='large' />
                        </div>;
                
        const errorMessage = <Alert
                                type="error"
                                message="Ошибка"
                                description={error}
                             />;

        const infoMessage = <Alert
                                type="info"
                                className="infoMessage"
                                message="Введите запрос"
                            />

        const input = tab === 1 ? searchInput : null;
        const className = tab === 1 ? "Search" : "Rated";
        const message = error ? errorMessage : infoMessage;
        const data = tab === 1 ? searchMovies : ratedMovies;
        const pagination = (!data.length || tab === 2 || loading) ? null : paginationSearchMovies;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" />
                    <TabPane tab="Rated" key="2" />
                </Tabs>
                <Section 
                    data={data}
                    error={error}
                    input={input}
                    loading={loading}
                    spinner={spinner}
                    message={message}
                    className={className}
                    pagination={pagination}
                    ratedMovies={ratedMovies}
                    pushRatedMovie={this.pushRatedMovie}
                />
            </Provider>
        );
    };
};
