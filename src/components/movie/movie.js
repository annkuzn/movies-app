import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';

import './movie.css';
import 'antd/dist/antd.css';

import MovieOverview from '../movie-overview/movie-overview';
import RateMovie from '../../services/rate-movie';
import Genres from '../genres/genres';
import VoteAverage from '../vote-average/vote-average';

export default class Movie  extends Component {

    rate = new RateMovie();

    myRef = React.createRef();

    state = {
        title: null,
        overview: null,
        date: null,
        poster: null,
        numberOfTitleLines: 1,
        rateValue: 0,
        voteAverage: 0,
        id: null,
        genresIds: null
    };

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

        this.rate.getRateMovie(movie.id)
        .then(res => {
            this.setState({
                rateValue: res.rated.value ?  res.rated.value : 0,
                voteAverage: +movie.vote_average,
                title: movie.title,
                overview: movie.overview,
                date: format(new Date(movie.release_date), 'LLLL d, y'),
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                numberOfTitleLines: titleHeight / lineHeight,
                id: movie.id,
                genresIds: movie.genre_ids
            });
        });
    };

    rateChangeHandler = (event) => {
        this.changeRateValue(event);
    };

    changeRateValue = (event) => {
        const { id } = this.state;
                
        this.rate.postRateMovie(id, event);

        this.setState({
            rateValue: event,
        });
    };

    render() {
        
        const { title, overview, date, poster, numberOfTitleLines, rateValue, voteAverage, genresIds } = this.state;
        const { movie } = this.props;

        return (
            <>
                <div className='movie__poster'>
                    <img className='movie__img' src={poster} alt={title} />
                </div>
                <div className='movie__details'>
                    <h1 className='movie__name' ref={this.myRef}>{movie.title}</h1>
                    <span className='movie__date'>{date}</span>
                    <Genres genresIds={genresIds}/>
                </div>
                <MovieOverview overview={overview} numberOfTitleLines={numberOfTitleLines} />
                <VoteAverage voteAverage={voteAverage}/>
                <Rate className='movie__rate' count={10} value={rateValue} onChange={this.rateChangeHandler}/>
            </>
        );
    };
};

Movie.defaultProps = {
    movie: [],
};

Movie.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    movie: PropTypes.object,
};