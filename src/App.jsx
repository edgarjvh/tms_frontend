import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import Root from './components/Root.jsx';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;
