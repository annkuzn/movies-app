import React, { Component } from 'react';
import { Tabs } from 'antd';

import 'antd/dist/antd.css';
import './app.css';

import { Provider } from '../context';

import Tab from '../tab/tab';
import MoviesData from '../../services/movies-data';
import SessionData from '../../services/session-data';
import RateMovie from '../../services/rate-movie';

export default class App extends Component {

    dataMovies = new MoviesData();

    sessionData = new SessionData();

    rateMovie = new RateMovie();

    state = {
        request: '',
        data: [],
        currentPage: 1,
        loading: true,
        error: false,
        pages: 1,
        tab: 1,
        genres: null
    };

    timer = null;

    componentDidMount() {
        if (!localStorage.token) {
            
            this.sessionData.getToken()
            .then(token => {
                this.sessionData.redirection(token);
                localStorage.setItem('session_id', token);
            })
        } else if (!localStorage.session_id) {
            this.sessionData.getSessionId(localStorage.token)
            .then(id => localStorage.setItem('session_id', id));
        };
        
        this.dataMovies.getGenres()
        .then(res => {
            this.setState({
                genres: res.genres
            });
        });
    };

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage, tab} = this.state;
        
        if(prevState.tab !== tab || prevState.request !== request || prevState.currentPage !== currentPage) {
            if(tab === 1) {
                if(request) {
                    const func = this.dataMovies.getMovies(currentPage, prevState.request, request);
                    this.searchMovies(func);
                };
            } else if(tab === 2) {
                const func = this.rateMovie.getRateMovies(currentPage)
                this.searchMovies(func);
            };
        };
    };

    searchMovies = (func) => {
        func.then(([movies, numberOfPages, curPage])=> {
            this.setState({
                data: movies[curPage],
                loading: false,
                error: false,
                currentPage: curPage,
                pages: numberOfPages
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

        const { data, loading, error, currentPage, pages, genres, tab} = this.state;

        const { TabPane } = Tabs;

        return (
            <Provider value={genres}>
                <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                    <TabPane tab="Search" key="1" >
                        <Tab 
                            tab={tab} 
                            data={data}
                            error={error}
                            pages={pages}
                            loading={loading} 
                            currentPage={currentPage} 
                            updateRequest={this.updateRequest}
                            paginationChangeHandler={this.paginationChangeHandler} 
                        />
                    </TabPane>
                    <TabPane tab="Rated" key="2" >
                        <Tab 
                            tab={tab} 
                            data={data}
                            error={error}
                            pages={pages}
                            loading={loading} 
                            currentPage={currentPage} 
                            paginationChangeHandler={this.paginationChangeHandler}                       
                        />
                    </TabPane>
                </Tabs>
            </Provider>
        );
    };
};
