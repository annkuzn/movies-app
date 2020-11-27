import React from 'react';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';

import Movie from '../movie/movie';

const Section = ({ data, error, loading, spinner, alert, className, ratedMovies, pushRatedMovie }) => {

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

export default Section;

Section.defaultProps = {
    data: null,
    error: false,
    loading: true,
    spinner: null,
    alert: null,
    className: 'search',
    ratedMovies: [],
    pushRatedMovie: (() => {}),
}

Section.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    loading: PropTypes.bool,
    spinner: PropTypes.element,
    alert: PropTypes.element,
    className: PropTypes.string,
    ratedMovies: PropTypes.arrayOf(PropTypes.object),
    pushRatedMovie: PropTypes.func,
}