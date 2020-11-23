import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate, Skeleton } from 'antd';

import 'antd/dist/antd.css';
import './movie.css';

import { Consumer } from '../../context';

import MovieApi from '../../services/movie-api';


export default class Movie  extends PureComponent {

    static defaultProps = {
        movie: [],
        pushRatedMovie: (() => {}),
        ind: 0
    };
    
    static propTypes = {
        movie: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
            PropTypes.array
        ])),
        pushRatedMovie: PropTypes.func,
        ind: PropTypes.number
    };

    movieApi = new MovieApi ();

    state = {
        rateValue: 0,
    };

    componentDidMount() {
        const { movie } = this.props;

        this.setState({
            rateValue: movie.rating ? movie.rating : 0
        })
    };

    rateChangeHandler = (event) => {
        this.changeRateValue(event);
    };

    changeRateValue = (event) => {
        const { pushRatedMovie, movie } = this.props;
                
        this.setState({
            rateValue: event,
        });

        const ratedMovie = {...movie, rating: event};
        pushRatedMovie(ratedMovie);
    };

    render() {
        
        const { rateValue } = this.state;
        const { ind, movie } = this.props;
        const { title, overview, release_date: releaseDate, poster_path: posterPath, vote_average: voteAverage, genre_ids: genreIds } = movie;
        const imageSkeleton = <Skeleton.Image className='movie__img'/>

        const img = <img className='movie__img' src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={title} />
        
        const image = img || imageSkeleton;

        return (
            <>
                <div className='movie__poster'>
                    {image}
                </div>
                <div className='movie__details'>
                    <h1 className='movie__name'>{title}</h1>
                    <span className='movie__date'>{format(new Date(releaseDate), 'LLLL d, y') || null}</span>
                    <Genres genresIds={genreIds}/>
                </div>
                <MovieOverview overview={overview} ind={ind} />
                <VoteAverage voteAverage={+voteAverage || null}/>
                <Rate className='movie__rate' count={10} value={rateValue} onChange={this.rateChangeHandler}/>
            </>
        );
    };
};

const Genres = ({ genresIds}) => {

    return (
        <Consumer>
            {genres => {
                    const movieGenres = genresIds ? genres.filter(genre => {
                        let result = false;
                        genresIds.forEach(item => {
                            if (genre.id === item) {
                                result = true;
                            };
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

class MovieOverview extends Component{

    static defaultProps = {
        overview: null,
        ind: 0
    };
    
    static propTypes = {
        overview: PropTypes.string,
        ind: PropTypes.number
    };

    state = {
        overview: null
    };

    componentDidMount() {
        this.updateDescr();
    };

    componentDidUpdate(prevProps) {
        const { overview } = this.props;

        if(prevProps.overview !== overview) {
            this.updateDescr();
        };
    };

    cutDescr = (overview) => {
        const { ind } = this.props;
        const titles = document.querySelectorAll('.movie__name');

        const lineHeight = 31;
        const currentTitle = titles[ind-1];
        const numberOfTitleLines = currentTitle.clientHeight / lineHeight

        let result = overview;

        const maxLengthOverview = 300;
        const numberHiddenSymbols = 80; // number of hidden overviews characters with one titles line

        const length = maxLengthOverview - numberOfTitleLines * numberHiddenSymbols;

        if (overview.length > length) {
            const newDescr = overview.substr(0, length);
            const index = newDescr.lastIndexOf(' ');

            result = `${newDescr.substr(0, index)}...`;
        };

        return result;
    };

    updateDescr = () => {
        const { overview } = this.props;

        this.setState({
            overview: overview ? this.cutDescr(overview) : null
        });
    };
 
    render() {
        const { overview } = this.state;

        return <p className='movie__descr'>{overview}</p>;
    };
};

Genres.defaultProps = {
    genresIds: null
};

Genres.propTypes = {
    genresIds: PropTypes.arrayOf(PropTypes.number)
};

const VoteAverage = ({ voteAverage }) => {

    let borderColor;

    if(voteAverage < 3) {
        borderColor = '#E90000';
    } else if (voteAverage < 5) {
        borderColor = '#E97E00';
    } else if (voteAverage < 7) {
        borderColor = '#E9D100';
    } else {
        borderColor = '#66E900';
    };

    return (
        <div className='movie__voteAverage' style={{ border: `2px solid ${borderColor}`}}>
            <span>{voteAverage}</span>
        </div>
    );
};

VoteAverage.defaultProps = {
    voteAverage: 0
};

VoteAverage.propTypes = {
    voteAverage: PropTypes.number
};