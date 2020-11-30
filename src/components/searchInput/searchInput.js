import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import debounce from 'lodash.debounce';


const SearchInput = ({ updateRequest, tab }) => {

    const updateRequestDebounce = debounce(updateRequest, 700);

    return tab === 1 ? (
        <Input 
            className="search-input" 
            placeholder='Type to search...' 
            onInput={updateRequestDebounce} 
            autoFocus
        />
    ) : null;
};

export default SearchInput;

SearchInput.defaultProps = {
    tab: 1,
    updateRequest: (() => {})
};

SearchInput.propTypes = {
    tab: PropTypes.number,
    updateRequest: PropTypes.func
};