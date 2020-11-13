import React from 'react';
import PropTypes from 'prop-types';
import { Input, Spin, Alert, Pagination } from 'antd';
import debounce from 'lodash.debounce';

import Movie from '../movie/movie';

import 'antd/dist/antd.css';

const Tab = ({data, loading, error, currentPage, pages, tab, sessionId, paginationChangeHandler, updateRequest}) => {

    const updateRequestDebounce = debounce(updateRequest, 700);

    const input = <Input placeholder='Type to search...' onInput={updateRequestDebounce} autoFocus/>;

    const spinner = <div className="spin">
                        <Spin size='large' />
                    </div>;

    const errorComponent =  <Alert
                                message="Ошибка"
                                description={error}
                                type="error"
                            />;
    let key = 0;                  
    const movies = data.map((movie) => {
        key += 1;
        return (
            <li key={key.toString()} className='movie'><Movie movie={movie} sessionId = {sessionId}/></li>
        )
    });

    const list = <ul className='movies__list'>
                    {movies}
                    </ul>;
        
        
    const paginationComp = <Pagination current={currentPage} onChange={paginationChangeHandler} defaultPageSize={6} total={pages}/>;

    const inputRender = tab === 1 ? input : null;

    const contentWithoutError = loading ? spinner : list;

    const errorMessage = error ? errorComponent : null;

    const content = error ? errorMessage : contentWithoutError;

    const pagination = content === list ? paginationComp : null;

    return (
        <>
            {inputRender}
            {content}
            <div className='movies__pagination'>{pagination}</div>
        </>
    )
                

}

export default Tab;

Tab.defaultProps = {
    data: null,
    loading: true,
    error: false,
    currentPage: 1,
    pages: 1,
    sessionId: null,
    updateRequest: (() => {}),
    tab: 1,
    paginationChangeHandler: (() => {})
}

Tab.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    error: PropTypes.bool,
    currentPage: PropTypes.number,
    pages: PropTypes.number,
    sessionId: PropTypes.string,
    updateRequest: PropTypes.func,
    tab: PropTypes.number,
    paginationChangeHandler: PropTypes.func
}