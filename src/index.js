import { h, Fragment } from './jsx';
import { render } from './render';
import CustomElement from './components/CustomElement';
import Custom2 from './components/Custom2';

const n = '3';

const vDom = (
  <Fragment>
    <CustomElement vava={7} />
    <CustomElement vava={7} />
    <Fragment>
      <div>3</div>
      <div>3</div>
    </Fragment>
    {[1, 2, 3].map(item => (
      <Custom2>
        <div>kk</div>
      </Custom2>
    ))}
  </Fragment>
);

render(vDom, document.getElementById('root'));
