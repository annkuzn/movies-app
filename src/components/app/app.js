import React, { Component } from 'react';

// eslint-disable-next-line import/no-unresolved
import './app.css';

import Movie from '../movie/movie';

import MoviesData from '../../services/movies-data';

export default class App extends Component {

    dataMovies = new MoviesData();

    state = {
        data: [],
        loading: true,
    };

    constructor() {
        super();
        this.updateData();
    }

    onError = (message) => {
        this.setState({
            loading: false
        })
    }

    updateData() {
        this.dataMovies
            .getMovies('return', '1')
            .then(movie => {
                this.setState({
                    data: movie,
                    loading: false
                })
            })
    };    


    render (){

        const { data } = this.state;
        const spinner = <div className="spin">
                            <Spin size='large' />
                        </div>;

        const movies = data.map(movie => {
            return (
                <li className='movies__item'><Movie movie={movie} /></li>
            )
        })

        const list = <ul className='movies__list'>
                        {movies}
                     </ul>;
        
        const contentWithoutError = loading ? spinner : list;
        return content;
    }
}
