import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import debounce from 'lodash.debounce';


const SearchInput = ({ updateRequest }) => {

    const updateRequestDebounce = debounce(updateRequest, 700);

    return (
        <Input 
            className="search-input" 
            placeholder='Type to search...' 
            onInput={updateRequestDebounce} 
            autoFocus
        />
    );
};

export default SearchInput;

SearchInput.defaultProps = {
    updateRequest: (() => {})
};

SearchInput.propTypes = {
    updateRequest: PropTypes.func
};