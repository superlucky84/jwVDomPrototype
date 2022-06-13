const keyPrefix = 'custom';
let seq = 0;
/*
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
*/

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

function redrawCustomComponent({ tag, props, children, prevVDom }) {
  const newVDom = tag({ props, children, prevVDom, redraw: true });
  const brothers = prevVDom.getBrothers();
  newVDom.brothers = brothers;
}

function makeCustemElement({ tag, props, newChildren }) {
  let prevVDom;
  const keyPrefix = tag.name;

  prevVDom = tag({
    props,
    children: newChildren,
    redrawCustomComponent: ({ props, children }) => {
      redrawCustomComponent({ tag, props, children, prevVDom });
    },
  });

  prevVDom.key = `${keyPrefix}-${seq}`;
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
