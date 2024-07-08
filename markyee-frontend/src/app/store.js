import { createStore, combineReducers } from 'redux';
import userReducer from './features/userReducer/userSlice';

const rootReducer = combineReducers({
  users: userReducer,
});

const store = createStore(rootReducer);

export default store;
