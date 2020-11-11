import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';

import './movie.css';
import 'antd/dist/antd.css';

import MovieOverview from '../movie-overview/movie-overview';
import RateMovie from '../../services/rate-movie';

export default class Movie  extends Component {

    rate = new RateMovie();

    state = {
        title: null,
        overview: null,
        date: null,
        poster: null,
        numberOfTitleLines: 1,
        rateValue: 0,
        id: null,
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

    rateChangeHandler = (event) => {
        this.changeRateValue(event);
    };

    createMovieCard() {
        const { movie } = this.props;

        const lineHeight = 31;
        const titleHeight = this.myRef.current.clientHeight;

        this.rate.getRateMovie(movie.id)
        .then(res => {
            this.setState({
                rateValue: res.rated.value ?  res.rated.value : 0,
                title: movie.title,
                overview: movie.overview,
                date: format(new Date(movie.release_date), 'LLLL d, y'),
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                numberOfTitleLines: titleHeight / lineHeight,
                id: movie.id,
            })
        })
    };

    async changeRateValue (event) {
        const { id } = this.state;
                
        this.rate.postRateMovie(id, event);

        this.setState({
            rateValue: event,
        })
    }

    render() {
        
        const { title, overview, date, poster, numberOfTitleLines, rateValue} = this.state;
        const { movie, currentPage } = this.props;

        return (
            <div className='movies__div'>
                <div>
                    <img className='movies__img' src={poster} alt={title} />
                </div>
                <div className='movies__details'>
                    <div>
                        <h1 className='movies__name' ref={this.myRef}>{movie.title}</h1>
                        <span className='movies__date'>{date}</span>
                        <span className='movies__genre'>Action</span>
                        <MovieOverview overview={overview} numberOfTitleLines={numberOfTitleLines} currentPage={currentPage}/>
                    </div>
                    <Rate count={10} value={rateValue} onChange={this.rateChangeHandler}/>
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