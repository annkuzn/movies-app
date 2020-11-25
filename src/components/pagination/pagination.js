import React from 'react';
import PropTypes from 'prop-types';
import { Pagination as PaginationAntd } from 'antd';


const Pagination = ({ totalPages, currentPage, paginationChangeHandler, defaultPageSize }) => {
    return (
        <PaginationAntd
            total={totalPages}
            current={currentPage}
            showSizeChanger={false}
            defaultPageSize={defaultPageSize}
            onChange={paginationChangeHandler}
        />
    );
};

export default Pagination;

Pagination.defaultProps = {
    totalPages: 1,
    currentPage: 1,
    defaultPageSize: 20,
    paginationChangeHandler: (() => {}),
};

Pagination.propTypes = {
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    defaultPageSize: PropTypes.number,
    paginationChangeHandler: PropTypes.func,
};