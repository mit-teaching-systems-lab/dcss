import { LOG_IN, LOG_OUT, SET_USERS } from './types';

export const logIn = userData => ({
    type: LOG_IN,
    payload: {
        ...userData,
        isLoggedIn: true
    }
});

export const logOut = userData => ({
    type: LOG_OUT,
    payload: {
        ...userData,
        isLoggedIn: false
    }
});

export const setUsers = payload => ({
    type: SET_USERS,
    payload
});

// export function handleCheckLoggedIn() {
//     return async function(dispatch) {
//         await axios
//             .get('/api/auth/me')
//             .then(function(response) {
//                 dispatch(checkLoggedIn(response.data));
//             })
//             .catch(function() {
//                 dispatch(loggedInFail());
//             });
//     };
// }

// export function handleLogout() {
//     return async function(dispatch) {
//         const response = await axios.post('/api/auth/logout');
//         if (response.status === 200) {
//             dispatch(logout());
//         }
//     };
// }
