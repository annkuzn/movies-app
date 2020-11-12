import React, { Component } from 'react';
import { Input, Spin, Alert, Pagination } from 'antd';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import Movie from '../movie/movie';

import 'antd/dist/antd.css';

export default class Tab extends Component {
    state = {

    }

    static defaultProps = {
        data: null,
        loading: true,
        error: false,
        currentPage: 1,
        pages: 1,
        updateRequest: (() => {}),
        tab: 1,
        onChange: (() => {})
    }

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object),
        loading: PropTypes.bool,
        error: PropTypes.bool,
        currentPage: PropTypes.number,
        pages: PropTypes.number,
        updateRequest: PropTypes.func,
        tab: PropTypes.number,
        onChange: PropTypes.func
    }

    render(){

        const { data, loading, error, currentPage, pages, updateRequest, tab, onChange } = this.props;

        const updateRequestDebounce = debounce(updateRequest, 700);

        const input = <Input placeholder='Type to search...' onInput={updateRequestDebounce} autoFocus/>;

        const inputRender = tab === 1 ? input : null;


        const spinner = <div className="spin">
                            <Spin size='large' />
                        </div>;

        const errorComponent =  <Alert
                                    message="Ошибка"
                                    description={error}
                                    type="error"
                                />

        const errorMessage = error ? errorComponent : null;


        const movies = data.map((movie) => {

            return (
                <li className='movies__item'><Movie movie={movie} currentPage={currentPage}/></li>
            )
        })

        const list = <ul className='movies__list'>
                        {movies}
                     </ul>;

        const paginationComp = <Pagination current={currentPage} onChange={onChange} defaultPageSize={6} total={pages}/>;
        
        const contentWithoutError = loading ? spinner : list;

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
}