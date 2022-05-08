import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import Root from './components/Root.jsx';

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;
