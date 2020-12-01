import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate, Skeleton } from 'antd';

import 'antd/dist/antd.css';
import './movie.css';

import { Consumer } from '../../context';

import { cutDescr, setRatingColor } from './helpers';


export default class Movie extends Component {

    static defaultProps = {
        ind: 0,
        movie: [],
        ratedMovies: [],
        pushRatedMovie: (() => {}),
    };
    
    static propTypes = {
        ind: PropTypes.number,
        movie: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
            PropTypes.array
        ])),
        ratedMovies: PropTypes.arrayOf(PropTypes.object),
        pushRatedMovie: PropTypes.func,
    };

    state = {
        currentOverview: null
    };

    componentDidMount() {
        this.updateDescr();
    };

    changeRateValue = (event) => {
        const { pushRatedMovie, movie } = this.props;
        const ratedMovie = {...movie, rating: event};

        pushRatedMovie(ratedMovie);
    };
    
    rateChangeHandler = (event) => {
        this.changeRateValue(event);
    };
    
    updateDescr = () => {
        const { ind, movie } = this.props;
        const { overview } = movie;

        this.setState({currentOverview: overview ? cutDescr(overview, ind) : null});
    };

    render() {
        
        const { movie, ratedMovies } = this.props;
        const { currentOverview } = this.state;
        const { title, release_date: releaseDate, poster_path: posterPath, vote_average: voteAverage, genre_ids: genreIds } = movie;
    
        const imageSkeleton = <Skeleton.Image className='movie__img'/>;
        const img = <img className='movie__img' src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={title} />;
        const image = posterPath ? img : imageSkeleton;
    
        const date = releaseDate ? format(new Date(releaseDate), 'LLLL d, y') : null;
    
        let rateValue = 0;
    
        ratedMovies.forEach(item => {
            if (movie.id === item.id) rateValue = item.rating;
        });
    
        return (
            <>
                <div className='movie__poster'>
                    {image}
                </div>
                <div className='movie__details'>
                    <h1 className='movie__name'>{title}</h1>
                    <span className='movie__date'>{date}</span>
                    <Genres genresIds={genreIds}/>
                </div>
                <p className='movie__descr'>{currentOverview}</p>
                <VoteAverage voteAverage={voteAverage}/>
                <Rate className='movie__rate' count={10} value={rateValue} onChange={this.rateChangeHandler}/>
            </>
        );
    };
};

const Genres = ({ genresIds }) => {
    return (
        <Consumer>
            {genres => {
                    const movieGenres = genresIds ? genres.filter(genre => {
                        let result = false;
                        genresIds.forEach(item => {
                            if (genre.id === item) result = true;
                        });

                        return result;
                    }) : null;

                    let key = 0;
                    
                    const currentGenres = movieGenres ? movieGenres.map( item => {
                        key += 1;

                        return (
                            <li key={key} className='movie__genre'>{item.name}</li>
                        )
                    }) : null;

                    return (
                        <div className='movie__genresList-block'>
                            <ul className='movie__genres-list'>
                                {currentGenres}
                            </ul>
                        </div>
                    );
                }}
        </Consumer>
    ); 
};



const VoteAverage = ({ voteAverage }) => {
    return (
        <div className='movie__voteAverage' style={{ border: `2px solid ${setRatingColor(voteAverage)}`}}>
            <span>{voteAverage}</span>
        </div>
    );
};

Genres.defaultProps = {
    genresIds: null
};

Genres.propTypes = {
    genresIds: PropTypes.arrayOf(PropTypes.number)
};

VoteAverage.defaultProps = {
    voteAverage: 0
};

VoteAverage.propTypes = {
    voteAverage: PropTypes.number
};