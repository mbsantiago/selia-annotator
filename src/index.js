import React from 'react';
import ReactDOM from 'react-dom';
import { Annotator } from './lib';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Annotator urls={urls} item={item} item_type={item_type} />,
  document.getElementById('annotator'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
