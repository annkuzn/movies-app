import React, { Component } from 'react';
import { Tabs } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../context';

import Section from '../section/section';
import MoviesData from '../../services/movies-data';
import SessionData from '../../services/session-data';
import RateMovie from '../../services/rate-movie';

export default class App extends Component {

    dataMovies = new MoviesData();

    sessionData = new SessionData();

    rateMovie = new RateMovie();

    state = {
        request: null,
        data: null,
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
        
        if (!this.sessionData.sessionId) {
            const id = await this.getId();
            this.setState({
                sessionId: id
            })
        };
        this.dataMovies.getGenres()
        .then(res => {
            this.setState({
                genres: res.genres
            });
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage, tab, sessionId} = this.state;
        if(prevState.tab !== tab || prevState.request !== request || prevState.currentPage !== currentPage) {

            this.changeLoading();

            if(prevState.tab !== tab) {
                this.removeRequest();
            }

            if(tab === 1) {
                if(request) {
                    const func = this.dataMovies.getMovies(currentPage, prevState.request, request);
                    this.searchMovies(func);
                } else {
                    this.handleEmptyRequest();
                }
            } else if(tab === 2) {
                const func = this.rateMovie.getRateMovies(sessionId)
                this.searchMovies(func);

            };
            
        };
    };

    componentDidCatch(err){
        this.onError(err.message);
    }

    async getId() {
        const result = await this.sessionData.getSessionId();
        return result;
    }

    handleEmptyRequest = () => {
        this.setState({
            error: false,
            loading: false,
            data: null
        })
    }

    removeRequest = () => {
        this.setState({
            request: null
        })
    }

    changeLoading = () => {
        this.setState({
            loading: true
        })
    }

    searchMovies = (func) => {
        func.then(([movies, pages, curPage])=> {
            this.setState({
                data: movies,
                loading: false,
                error: false,
                totalPages: pages,
                currentPage: curPage
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
            request: newRequest.target.value
        });
    };

    updateSearchTab = (tabKey) => {
        this.setState({
            tab: +tabKey,
            currentPage: 1,
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

        const { data, loading, error, currentPage, totalPages, genres, tab, sessionId} = this.state;
        const className = tab === 1 ? "Search" : "Rated";
        const { TabPane } = Tabs;
        
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
                    updateRequest={this.updateRequest}
                    paginationChangeHandler={this.paginationChangeHandler}
                />
            </Provider>
        );
    };
};
