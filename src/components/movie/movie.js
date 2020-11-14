import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';

import './movie.css';
import 'antd/dist/antd.css';

import MovieOverview from '../movie-overview/movie-overview';
import RateMovie from '../../services/rate-movie';
import Genres from '../genres/genres';
import VoteAverage from '../vote-average/vote-average';

import SessionData from '../../services/session-data';

export default class Movie  extends PureComponent {

    rate = new RateMovie();

    sessionData = new SessionData ();

    myRef = React.createRef();

    state = {
        title: null,
        overview: null,
        date: null,
        poster: null,
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

        this.setState({
            rateValue: movie.rating ? movie.rating : 0,
            voteAverage: +movie.vote_average,
            title: movie.title,
            overview: movie.overview,
            date: format(new Date(movie.release_date), 'LLLL d, y'),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            id: movie.id,
            genresIds: movie.genre_ids
        });
    };

    rateChangeHandler = (event) => {
        this.changeRateValue(event);
    };

    changeRateValue = (event) => {
        const { id } = this.state;
        const { sessionId } = this.props;
                
        this.rate.postRateMovie(id, event, sessionId);

        this.setState({
            rateValue: event,
        });
    };

    render() {
        
        const { title, overview, date, poster, rateValue, voteAverage, genresIds } = this.state;
        const { ind } = this.props;
        return (
            <>
                <div className='movie__poster'>
                    <img className='movie__img' src={poster} alt={title} />
                </div>
                <div className='movie__details'>
                    <h1 className='movie__name' >{title}</h1>
                    <span className='movie__date'>{date}</span>
                    <Genres genresIds={genresIds}/>
                </div>
                <MovieOverview overview={overview} ind={ind} />
                <VoteAverage voteAverage={voteAverage}/>
                <Rate className='movie__rate' count={10} value={rateValue} onChange={this.rateChangeHandler}/>
            </>
        );
    };
};

Movie.defaultProps = {
    movie: [],
    sessionId: null,
    ind: 0
};

Movie.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    movie: PropTypes.object,
    sessionId: PropTypes.string,
    ind: PropTypes.number
};