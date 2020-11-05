import React, { Component } from 'react';
import { Spin, Alert, Input } from 'antd';

// eslint-disable-next-line import/no-unresolved
import './app.css';
import 'antd/dist/antd.css';

import Movie from '../movie/movie';

import MoviesData from '../../services/movies-data';

export default class App extends Component {

    dataMovies = new MoviesData();

    state = {
        data: null,
        loading: true,
        error: false
    };

    componentDidMount() {
        this.dataMovies
        .getMovies('return', '1')
        .then(movie => {
            this.setState({
                data: movie,
                loading: false
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

    render (){

        const { data, loading, error } = this.state;

        const spinner = <div className="spin">
                            <Spin size='large' />
                        </div>;

        if (!data) {
            return spinner;
        }

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
        
        const contentWithoutError = loading ? spinner : list;

        const content = error ? errorMessage : contentWithoutError;

        return (
            <div>
                <Input placeholder='Type to search...' />
                {content}
            </div>
        )
    }
}
