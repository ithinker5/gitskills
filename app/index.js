import {ReactDOM} from './vendors/browsers';

(function () {
  console.log('hello webpack');
  console.log('hello two');

  ReactDOM.render(<h1>hello react</h1>, $('#testid').get(0));
}());

