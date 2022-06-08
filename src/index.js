import { h, Fragment, vDomToDom } from './jsx';

const v = 'j';
const w = 'kkk';
const n = '3';

const node = (
  <Fragment>
    <div va={n} style={{ fontWeight: 'bold', color: 'red' }}>
      <>
        <span>3ll</span>
        <span>
          3lll{w}
          <b> 7 </b>3www
        </span>
      </>
      ss{v}ss
    </div>
    <div>kk</div>
  </Fragment>
);

console.log('VDOM = ', node);

const resultElements = vDomToDom(node);

document.getElementById('root').appendChild(resultElements);

export default {
  node,
};
