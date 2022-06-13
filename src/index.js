import { h, Fragment } from './jsx';
import { render } from './render';
import CustomElement from './components/CustomElement';

const n = '3';

const vDom = (
  <Fragment>
    <div va={n} style={{ fontWeight: 'bold', color: 'red' }}>
      aaa
      <CustomElement vava={1}>asdg</CustomElement>
      bbb
    </div>
    <div>
      <CustomElement vava={7} />
    </div>
    <div>kk</div>
  </Fragment>
);

console.log('VDOM = ', vDom);

render(vDom, document.getElementById('root'));
