import React, { Component } from 'react';
import { Spin, Alert, Input, Pagination, Tabs } from 'antd';
import  debounce  from 'lodash.debounce';

// eslint-disable-next-line import/no-unresolved

import 'antd/dist/antd.css';
import './app.css';

import Movie from '../movie/movie';

import MoviesData from '../../services/movies-data';
import RequestToken from '../../services/request-token';
import RateMovie from '../../services/rate-movie';

export default class App extends Component {

    dataMovies = new MoviesData();

    requestToken = new RequestToken();

    rateMovie = new RateMovie();

    state = {
        request: '',
        data: [],
        currentPage: 1,
        loading: true,
        error: false,
        pages: 1,
        tab: 1
    };

    timer = null;

    componentDidMount() {
        if (!localStorage.token) {
            this.requestToken.getToken()
            .then(token => {
                this.requestToken.redirection(token);
                localStorage.setItem('token', token);
            })
        } else if (!localStorage.session_id) {
            this.requestToken.getSessionId(localStorage.token)
            .then(id => localStorage.setItem('session_id', id))
        } 
    }

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage, tab} = this.state;

        if(prevState.tab !== tab || prevState.request !== request || prevState.currentPage !== currentPage) {
            console.log(currentPage, 'currentPage')
            if(tab === 1) {
                if(request) {
                    const func = this.dataMovies.getMovies(currentPage, prevState.request, request);
                this.searchMovies(func);
                }
            } else if(tab === 2) {
                const func = this.rateMovie.getRateMovies(currentPage)
                this.searchMovies(func);
            }
        }
    }

    searchMovies = (func) => {
        
        func.then(([movies, numberOfPages, curPage])=> {
            this.setState({
                data: movies[curPage],
                loading: false,
                error: false,
                currentPage: curPage,
                pages: numberOfPages
            })
        })
        .catch((err) => {this.onError(err.message)}); 
    }
 
    onError = (message) => {
        this.setState({
            error: message,
            loading: false
        })
    }

    onChange = page => {
        this.setState({
            currentPage: page,
        });
      };

    updateRequest = (newRequest) => {
        this.setState({
            request: newRequest.target.value
        })
    }

    updateSearchTab = (tabKey) => {
        this.setState({
            tab: +tabKey,
            currentPage: 1,
            loading: true,
        })
    }
 
    tabClickHandler = (tabKey) => {
        this.updateSearchTab(tabKey);
    }

    render (){

        const { data, loading, error, currentPage, pages} = this.state;

        const { TabPane } = Tabs;

        const updateRequestDebounce = debounce(this.updateRequest, 700);

        const spinner = <div className="spin">
                            <Spin size='large' />
                        </div>;

        const errorComponent =  <Alert
                                    message="Ошибка"
                                    description={error}
                                    type="error"
                                />

        const errorMessage = error ? errorComponent : null;


        const movies = data.map((movie) => {

            return (
                <li className='movies__item'><Movie movie={movie} currentPage={currentPage}/></li>
            )
        })

        const list = <ul className='movies__list'>
                        {movies}
                     </ul>;

        const paginationComp = <Pagination current={currentPage} onChange={this.onChange} defaultPageSize={6} total={pages}/>;
        
        const contentWithoutError = loading ? spinner : list;

        const content = error ? errorMessage : contentWithoutError;

        const pagination = content === list ? paginationComp : null;


        return (
            <Tabs defaultActiveKey="1" centered onTabClick={this.tabClickHandler}>
                <TabPane tab="Search" key="1" >
                    <Input placeholder='Type to search...' onInput={updateRequestDebounce} autoFocus/>
                    {content}
                    <div className='movies__pagination'>{pagination}</div>
                </TabPane>
                <TabPane tab="Rated" key="2" >
                    {content}
                    <div className='movies__pagination'>{pagination}</div>
                </TabPane>
            </Tabs>
                
            
        )
    }
}
