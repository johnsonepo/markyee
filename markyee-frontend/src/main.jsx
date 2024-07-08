import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './app/store.js';
import AppRouter from './router/router.jsx';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
)
