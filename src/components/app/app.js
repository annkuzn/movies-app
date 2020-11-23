import React, { Component } from 'react';
import { Tabs, Input, Spin, Alert, Pagination } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../../context';

import Section from '../section/section';
import MovieApi from '../../services/movie-api';

export default class App extends Component {

    movieApi = new MovieApi();

    state = {
        request: null,
        searchMovies: [],
        ratedMovies: [],
        currentPage: 1,
        loading: false,
        error: false,
        totalPages: 1,
        tab: 1,
        genres: null,
        sessionId: null
    };

    timer = null;

    async componentDidMount() {   
        
        if (!this.movieApi.sessionId) {
            const id = await this.getId();

            this.setState({
                sessionId: id
            });
        };

        this.movieApi.getGenres()
        .then(res => {
            this.setState({
                genres: res.genres
            });
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage, tab, ratedMovies } = this.state;

        if (prevState.tab !== tab || prevState.request !== request || prevState.currentPage !== currentPage) {
            this.changeLoading(true);

            if (tab === 1) {

                if (request) {
                    const func = this.movieApi.getMovies(currentPage, prevState.request, request);
                    this.searchMovies(func);
                } else {
                    this.changeLoading(false);
                    this.onError(false);
                }
            } else if (tab === 2) {
                this.changeLoading(false);
                if (!ratedMovies.length) this.onError('Пока нет оцененных фильмов');
            };
            
        };
    };

    componentDidCatch(err){
        this.onError(err.message);
    }

    async getId() {
        const result = await this.movieApi.getSessionId();
        return result;
    }

    removeRequest = () => {
        this.setState({
            request: null
        })
    }

    changeLoading = (load) => {
        this.setState({
            loading: load
        })
    }

    searchMovies = (func) => {
        const { currentPage } = this.state;

        func.then(([ movies, pages, curPage ])=> {

            this.setState({
                searchMovies: movies,
                loading: false,
                error: false,
                totalPages: pages,
                currentPage: curPage || currentPage
            });
        })
        .catch((err) => {this.onError(err.message)}); 
    };
 
    onError = (message) => {
        this.setState({
            error: message,
            loading: false
        });
    };

    changePage = page => {
        this.setState({
            currentPage: page,
        });
      };    

    updateRequest = (newRequest) => {
        this.setState({
            request: newRequest.target.value.trim()
        });
    };

    pushRatedMovie = (movie) => {
        const { ratedMovies } = this.state;

        this.setState({
            ratedMovies: [...ratedMovies, movie]
        });
    }

    updateSearchTab = (tabKey) => {
        this.setState({
            tab: +tabKey,
            loading: true,
        });
    };
 
    tabClickHandler = (tabKey) => {
        this.updateSearchTab(tabKey);
    };

    paginationChangeHandler = (page) => {
        this.changePage(page);
    }

    render () {

        const { searchMovies, ratedMovies, loading, error, currentPage, totalPages, genres, tab, sessionId} = this.state;
        const className = tab === 1 ? "Search" : "Rated";
        const { TabPane } = Tabs;
        const data = tab === 1 ? searchMovies : ratedMovies;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" />
                    <TabPane tab="Rated" key="2" />
                </Tabs>
                <Section 
                    className={className}
                    tab={tab} 
                    data={data}
                    error={error}
                    loading={loading}
                    sessionId={sessionId}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    Input={Input}
                    Spin={Spin}
                    Alert={Alert}
                    Pagination={Pagination}
                    updateRequest={this.updateRequest}
                    pushRatedMovie={this.pushRatedMovie}
                    paginationChangeHandler={this.paginationChangeHandler}
                />
            </Provider>
        );
    };
};
