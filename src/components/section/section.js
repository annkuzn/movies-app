import React from 'react';
import PropTypes from 'prop-types';

import Movie from '../movie/movie';

import 'antd/dist/antd.css';

const Section = ({ data, error, input, loading, spinner, message, sessionId, className, pushRatedMovie, pagination }) => {

    let key = 0;
                    
    const movies =  data.length ? data.map((movie) => {
                        key += 1;
                        return (
                            <li key={key.toString()} className='movie'>
                                <Movie 
                                    movie={movie} 
                                    sessionId={sessionId} 
                                    ind={key} 
                                    pushRatedMovie={pushRatedMovie}
                                />
                            </li>
                        )
                    }) : null;

    const list = movies ? <ul className='movies__list'>
                {movies}
                </ul> : null;

    const contentWithoutError = loading ? spinner : list;

    const content = (error || (!loading && !movies)) ? message : contentWithoutError;

    return (
        <section className={className}>
            {input}
            {content}
            <div className='movies__pagination'>{pagination}</div>
        </section>
    )
}

export default Section;

Section.defaultProps = {
    data: null,
    error: false,
    input: null,
    loading: true,
    spinner: null,
    message: null,
    sessionId: null,
    className: 'search',
    pagination: null,
    pushRatedMovie: (() => {}),
}

Section.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    input:PropTypes.element,
    loading: PropTypes.bool,
    spinner: PropTypes.element,
    message: PropTypes.element,
    sessionId: PropTypes.string,
    className: PropTypes.string,
    pagination: PropTypes.element,
    pushRatedMovie: PropTypes.func,
}