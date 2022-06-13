const keyPrefix = 'custom';
let seq = 0;
let value = {};

const useState = ({ initValue, vdomKey, stateCallSeq, render }) => {
  const currentSubSeq = stateCallSeq;

  if (!value[vdomKey] || !value[vdomKey][currentSubSeq]) {
    value[vdomKey] ??= {};
    value[vdomKey][currentSubSeq] ??= {};
    value[vdomKey][currentSubSeq] = initValue;
  }

  const setData = newValue => {
    value[vdomKey][currentSubSeq] = newValue;
    render();
  };

  // console.log(value);

  return [value[vdomKey][currentSubSeq], setData];
};

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

export function Fragment({ props, children }) {
  return {
    type: 'fragment',
    props,
    children,
  };
}

function redrawCustomComponent({ tag, props, newChildren, prevVDom }) {
  const prevVDomKey = prevVDom.key;
  const newVDom = makeCustemElement({ tag, props, newChildren, prevVDomKey });
  // const brothers = prevVDom.getBrothers();
  newVDom.getBrothers = prevVDom.getBrothers;

  console.log(newVDom);
}

function makeCustemElement({ tag, props, newChildren, prevVDomKey }) {
  let prevVDom;
  let stateCallSeq = 0;
  const keyPrefix = tag.name;
  const vdomKey = prevVDomKey || `${keyPrefix}-${seq}`;

  prevVDom = tag({
    props,
    children: newChildren,
    useState: initValue => {
      const state = useState({
        initValue,
        vdomKey,
        stateCallSeq,
        render: () => {
          redrawCustomComponent({ tag, props, newChildren, prevVDom });
          console.log('RENDER');
        },
      });

      stateCallSeq += 1;

      return state;
    },
  });

  prevVDom.key = vdomKey;
  seq += 1;

  return prevVDom;
}

export function h(tag, props, ...children) {
  const node = {
    type: 'element',
    tag,
    props,
  };

  const newChildren = children.map(item => {
    return makeChildren({
      item,
      getBrothers: () => node.children,
      getParent: () => node,
    });
  });

  // 플레그먼트일때
  if (typeof tag === 'function' && tag.name === 'Fragment') {
    return tag({
      props,
      children: newChildren,
    });
  }
  // 사용자 컴포넌트 일때
  else if (typeof tag === 'function') {
    return makeCustemElement({ tag, props, newChildren });
  }

  node.children = newChildren;

  return node;
}

function makeChildren({ item, getBrothers, getParent }) {
  if (typeof item === 'string' || typeof item === 'number') {
    return {
      type: 'text',
      text: item,
      getBrothers,
      getParent,
    };
  }

  item.type = 'element';
  item.getBrothers = getBrothers;
  item.getParent = getParent;

  return item;
}
