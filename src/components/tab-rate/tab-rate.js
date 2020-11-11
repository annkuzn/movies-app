import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';

const TabRate = ({ paginationRate, contentRate}) => {

    const { TabPane } = Tabs;

    return (
        <TabPane tab="Rated" key="2">
            {contentRate}
            <div className='movies__pagination'>{paginationRate}</div>
        </TabPane>
    )
}

export default TabRate;

TabRate.defaultProps = {
    paginationRate: null,
    contentRate: null,
}

TabRate.propTypes = {
    paginationRate: PropTypes.objectOf(PropTypes.object),
    contentRate: PropTypes.objectOf(PropTypes.object),
}
