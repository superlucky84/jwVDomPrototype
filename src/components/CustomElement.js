import { h, Fragment } from '../jsx';

export default function CustomElement({ props = {}, children, prevVDom }) {
  let vdom;
  let v = 3;

  const handle = () => {
    console.log('a');
  };

  vdom = (
    <div class="jj">
      <span onClick={handle}>{v}-vava</span>
    </div>
  );

  return vdom;
}
