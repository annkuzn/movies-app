import React, { Component } from 'react';

import './app.css';

import Movie from '../movie/movie';

import DataMovies from '../../services/data';

export default class App extends Component {

    dataMovies = new DataMovies();

    state = {
        data: []
    };

    constructor() {
        super();
        this.updateData();
    }

    updateData() {
        this.dataMovies
            .getMovies('return', '1')
            .then(movie => {
                this.setState({
                    data: movie
                })
            })
    };    


    render (){

        const { data } = this.state;
        const movies = data.map(movie => {
            return (
                <li className='movies__item'><Movie movie={movie} /></li>
            )
        })
        
        return (
            <ul className='movies__list'>
                {movies}
            </ul>
        )
    }
}
