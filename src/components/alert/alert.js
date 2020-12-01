import React from 'react';
import PropTypes from 'prop-types';
import { Alert as AlertAntd } from 'antd';

const Alert = ({ tab, data, error, loading }) => {
    const type = error ? "error" : "info";
    const infoMessage = tab === 1 ? "Введите запрос" : "Пока нет оцененных фильмов";

    return ((error && !loading) || (!loading && !data.length)) ? (
        <AlertAntd
            type={type}
            message={error ? "Ошибка" : infoMessage}
            description={error}
        /> 
    ) : null;
};

Alert.defaultProps = {
    tab: 1,
    data: [],
    error: false,
    loading: false
};

Alert.propTypes = {
    tab: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.bool,
    loading: PropTypes.bool
};