import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import Movie from '../movie/movie';

import 'antd/dist/antd.css';

const Section = ({Input, Spin, Alert, Pagination, className, data, loading, error, currentPage, totalPages, tab, sessionId, paginationChangeHandler, pushRatedMovie, updateRequest}) => {

    const updateRequestDebounce = debounce(updateRequest, 700);

    const input = <Input className="search-input" placeholder='Type to search...' onInput={updateRequestDebounce} autoFocus/>;

    const spinner = <div className="spin">
                        <Spin size='large' />
                    </div>;

    const errorMessage =  <Alert
                                message="Ошибка"
                                description={error}
                                type="error"
                            />;

    const infoMessage = <Alert 
                            className="infoMessage"
                            message="Введите запрос"
                            type="info"
                        />

    let key = 0;                  
    const movies = data.length ? data.map((movie) => {
        key += 1;
        return (
            <li key={key.toString()} className='movie'><Movie movie={movie} sessionId={sessionId} ind={key} pushRatedMovie={pushRatedMovie}/></li>
        )
    }) : null;

    const list = movies ? <ul className='movies__list'>
                    {movies}
                    </ul> : null;

    const paginationComp =  <Pagination 
                                total={totalPages}
                                defaultPageSize={20}
                                current={currentPage}
                                showSizeChanger={false}
                                onChange={paginationChangeHandler}
                            />;

    const inputRender = tab === 1 ? input : null;

    const contentWithoutError = loading ? spinner : list;

    const message = error ? errorMessage : infoMessage;

    const content = (error || (!loading && !movies)) ? message : contentWithoutError;

    const pagination = (!data.length || tab === 2 || loading) ? null : paginationComp;

    return (
        <section className={className}>
            {inputRender}
            {content}
            <div className='movies__pagination'>{pagination}</div>
        </section>
    )
                

}

export default Section;

Section.defaultProps = {
    className: 'search',
    data: null,
    loading: true,
    error: false,
    currentPage: 1,
    totalPages: 1,
    sessionId: null,
    pushRatedMovie: (() => {}),
    updateRequest: (() => {}),
    tab: 1,
    paginationChangeHandler: (() => {}),
    Input: null,
    Spin: null,
    Alert: null,
    Pagination: null,
    }

Section.propTypes = {
    Input: PropTypes.element,
    Spin: PropTypes.element,
    Alert: PropTypes.element,
    Pagination: PropTypes.element,
    className: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    sessionId: PropTypes.string,
    pushRatedMovie: PropTypes.func,
    updateRequest: PropTypes.func,
    tab: PropTypes.number,
    paginationChangeHandler: PropTypes.func
}