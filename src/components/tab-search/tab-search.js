import React, { Component } from 'react';
import { Tabs, Input } from 'antd';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import 'antd/dist/antd.css';

export default class TabSearch extends Component {
    state = {

    }

    static defaultProps = {
        paginationSearch: null,
        contentSearch: null,
        updateRequest: null
    }

    static propTypes = {
        paginationSearch: PropTypes.objectOf(PropTypes.object),
        contentSearch: PropTypes.objectOf(PropTypes.object),
        updateRequest: PropTypes.func
    }

    render(){

        const { paginationSearch, contentSearch, updateRequest } = this.props;
        const { TabPane } = Tabs;

        const updateRequestDebounce = debounce(updateRequest, 700);

        return (
            <TabPane tab="Search" key="1" >
                        <Input placeholder='Type to search...' onInput={updateRequestDebounce} autoFocus/>
                        {contentSearch}
                        <div className='movies__pagination'>{paginationSearch}</div>
            </TabPane>
        )
    }
}