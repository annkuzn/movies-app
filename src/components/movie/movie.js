import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';

import './movie.css';
import 'antd/dist/antd.css';

import MovieOverview from '../movie-overview/movie-overview';


export default class Movie  extends Component {

    state = {
        title: null,
        overview: null,
        date: null,
        poster: null,
        numberOfTitleLines: 1
    }

    myRef = React.createRef();

    componentDidMount() {
        this.createMovieCard();
    };

    componentDidUpdate(prevProp) {
        const { movie } = this.props;

        if(prevProp.movie !== movie) {
            this.createMovieCard();
        };
    };

    createMovieCard = () => {
        const { movie } = this.props;

        const lineHeight = 31;
        const titleHeight = this.myRef.current.clientHeight;
        
        this.setState({
            title: movie.title,
            overview: movie.overview,
            date: format(new Date(movie.release_date), 'LLLL d, y'),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            numberOfTitleLines: titleHeight / lineHeight
        });
    };

    render() {
        const { title, overview, date, poster, numberOfTitleLines} = this.state;
        const { movie, currentPage } = this.props;

        return (
            <div className='movies__div'>
                <div>
                    <img className='movies__img' src={poster} alt={title} />
                </div>
                <div className='movies__details'>
                    <h1 className='movies__name' ref={this.myRef}>{movie.title}</h1>
                    <span className='movies__date'>{date}</span>
                    <span className='movies__genre'>Action</span>
                    <MovieOverview overview={overview} numberOfTitleLines={numberOfTitleLines} currentPage={currentPage}/>
                    <Rate />
                </div>
            </div>
        )
    };
};

Movie.defaultProps = {
    movie: [],
    currentPage: null
};

Movie.propTypes = {
    movie: PropTypes.arrayOf(PropTypes.object),
    currentPage: PropTypes.number
};