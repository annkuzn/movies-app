import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate, Skeleton } from 'antd';

import 'antd/dist/antd.css';
import './movie.css';

import MovieOverview from '../movie-overview/movie-overview';
import RateMovie from '../../services/rate-movie';
import Genres from '../genres/genres';
import VoteAverage from '../vote-average/vote-average';

import SessionData from '../../services/session-data';

export default class Movie  extends PureComponent {

    static defaultProps = {
        movie: [],
        sessionId: null,
        ind: 0
    };
    
    static propTypes = {
        movie: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
            PropTypes.array
        ])),
        sessionId: PropTypes.string,
        ind: PropTypes.number
    };

    rate = new RateMovie();

    sessionData = new SessionData ();

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
            date: movie.release_date ? format(new Date(movie.release_date), 'LLLL d, y') : null,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
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

        const imageSkeleton = <Skeleton.Image className='movie__img'/>

        const img = <img className='movie__img' src={poster} alt={title} />
        
        const image = poster ? img : imageSkeleton;

        return (
            <>
                <div className='movie__poster'>
                    {image}
                </div>
                <div className='movie__details'>
                    <h1 className='movie__name'>{title}</h1>
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