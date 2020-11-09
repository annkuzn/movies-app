import React, { Component } from 'react';
import { Spin, Alert, Input, Pagination } from 'antd';
import  debounce  from 'lodash.debounce';

// eslint-disable-next-line import/no-unresolved
import './app.css';
import 'antd/dist/antd.css';

import Movie from '../movie/movie';

import MoviesData from '../../services/movies-data';
import RequestToken from '../../services/request-token';

export default class App extends Component {

    dataMovies = new MoviesData();

    requestToken = new RequestToken();

    state = {
        request: '',
        data: [],
        currentPage: 1,
        loading: true,
        error: false,
        pages: 1,
        accauntId: null
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
        } else {
            this.requestToken.getAccauntId(localStorage.session_id)
            .then(res => {
                this.setState({
                    accauntId: res
                })
            })
            .then(() => {
                const { accauntId } = this.state;
                console.log(accauntId);
            })
        }

        
    }

    componentDidUpdate(prevProp, prevState) {
        const { request, currentPage} = this.state;

        if(prevState.request !== request || prevState.currentPage !== currentPage) {
           this.dataMovies
            .getMovies(prevState.request, request, currentPage)
            .then(([movies, numberOfPages, curPage])=> {
                this.setState({
                    data: movies[curPage],
                    loading: false,
                    error: false,
                    currentPage: curPage,
                    pages: numberOfPages
                })
            })
            // .catch((err) => {this.onError(err.message)}); 
        }
        
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

    render (){

        const { data, loading, error, currentPage, pages } = this.state;

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

        const movies = data.map(movie => {
            return (
                <li className='movies__item'><Movie movie={movie} /></li>
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
            <div>
                <Input placeholder='Type to search...' onInput={updateRequestDebounce} autoFocus/>
                {content}
                <div className='movies__pagination'>{pagination}</div>
            </div>
        )
    }
}
