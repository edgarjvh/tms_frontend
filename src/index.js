import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import jQuery from 'jquery';

(function($) {
  $.fn.hasScrollBar = function() {
      return this.get(0).scrollHeight > this.get(0).clientHeight;
  }
})(jQuery);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

reportWebVitals();
