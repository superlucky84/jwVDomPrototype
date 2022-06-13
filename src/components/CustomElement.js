import { h, Fragment } from '../jsx';

const keyPrefix = 'custom';
let seq = 0;
let stateCallSeq = 0;
let value = {};

const useState = (initValue, vdomKey) => {
  const currentSubSeq = stateCallSeq;

  if (!value[vdomKey] || !value[vdomKey][currentSubSeq]) {
    value[vdomKey] ??= {};
    value[vdomKey][currentSubSeq] ??= {};

    value[vdomKey][currentSubSeq] = initValue;
  }

  const setData = newValue => {
    value[vdomKey][currentSubSeq] = newValue;
  };

  stateCallSeq += 1;

  console.log(value);

  return [value[vdomKey][currentSubSeq], setData];
};

export default function CustomElement({ props = {}, children, prevVDom }) {
  stateCallSeq = 0;

  let vdom;
  const vdomKey = getVDomKey(prevVDom);
  const [v, setV] = useState(props.vava, vdomKey);
  console.log('V', v);

  const handle = () => {
    setV(v + 1);
    redrawComponet({ props, children, vdom });
  };

  vdom = <span onClick={handle}>{v}-vava</span>;
  vdom.key = vdomKey;

  return vdom;
}

function redrawComponet({ props, children, vdom }) {
  const newVDom = CustomElement({ props, children, prevVDom: vdom });
  console.log('NEWVDOM - ', newVDom);
}

function getVDomKey(prevVDom) {
  let vdomKey;
  if (prevVDom) {
    vdomKey = prevVDom.key;
  } else {
    vdomKey = `${keyPrefix}-${seq}`;
    seq += 1;
  }

  return vdomKey;
}
