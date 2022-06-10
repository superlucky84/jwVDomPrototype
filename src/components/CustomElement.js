import { h, Fragment } from '../jsx';

let seq = 0;
let value = [];

const useState = initValue => {
  if (!value) {
    value = initValue;
  }

  const setData = newValue => {
    value = newValue;
  };

  return [value, setData];
};

export default function CustomElement(props = {}, children) {
  let vdom;
  const [v, setV] = useState(props.vava);

  console.log(props.vava);
  console.log('V', v);

  const handle = () => {
    setV(v + 1);
    console.log(vdom, CustomElement(props, children));
  };

  vdom = (
    <span onClick={handle}>
      {v}-{props?.vava || '1'}
    </span>
  );

  vdom.key = seq++;

  return vdom;
}
