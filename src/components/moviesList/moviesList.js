import React from 'react';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';

import Movie from '../movie/movie';

const MoviesList = ({ data, error, alert, loading, spinner, className, ratedMovies, pushRatedMovie }) => {
    let key = 0;
                    
    const movies =  data.length ? data.map((movie) => {
                        key += 1;
                        return (
                            <li key={key.toString()} className='movie'>
                                <Movie
                                    ind={key}
                                    movie={movie} 
                                    ratedMovies={ratedMovies}
                                    pushRatedMovie={pushRatedMovie}
                                />
                            </li>
                        )
                    }) : null;

    const list = movies ? <ul className='movies__list'>
                {movies}
                </ul> : null;

    const contentWithoutError = loading ? spinner : list;

    const content = (error || (!loading && !movies)) ? alert : contentWithoutError;

    return (
        <section className={className}>
            {content}
        </section>
    )
}

export default MoviesList;

MoviesList.defaultProps = {
    data: null,
    error: false,
    alert: null,
    loading: true,
    spinner: null,
    className: 'search',
    ratedMovies: [],
    pushRatedMovie: (() => {}),
}

MoviesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    alert: PropTypes.element,
    loading: PropTypes.bool,
    spinner: PropTypes.element,
    className: PropTypes.string,
    ratedMovies: PropTypes.arrayOf(PropTypes.object),
    pushRatedMovie: PropTypes.func,
}