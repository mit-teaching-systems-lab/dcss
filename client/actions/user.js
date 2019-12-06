import {
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
    SET_USER
    // SET_USER_SUCCESS,
    // SET_USER_ERROR
} from './types';

export const setUser = user => ({
    type: SET_USER,
    user
});

export const getUser = ({ id }) => async dispatch => {
    dispatch({ type: GET_USER, user: { id } });
    try {
        const user = await (await fetch(`/api/me`)).json();
        dispatch({ type: GET_USER_SUCCESS, user });
        return user;
    } catch (error) {
        const { message, status, stack } = error;
        dispatch({ type: GET_USER_ERROR, status, message, stack });
    }
};
