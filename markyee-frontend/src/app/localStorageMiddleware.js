import { loginUser, logoutUser, updateUser, removeUser } from './features/userReducer/userSlice';

const localStorageMiddleware = store => next => action => {
    const result = next(action);
    const state = store.getState();

    switch (action.type) {
        case loginUser.type:
        case updateUser.type:
            Object.keys(state.users).forEach(username => {
                localStorage.setItem(`user_${username}`, JSON.stringify(state.users[username]));
            });
            break;
        case logoutUser.type:
        case removeUser.type:
            localStorage.removeItem(`user_${action.payload.username}`);
            break;
        default:
            break;
    }

    return result;
};
export default localStorageMiddleware;