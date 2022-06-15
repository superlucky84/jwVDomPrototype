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

  return [value[vdomKey][currentSubSeq], setData];
};

export function Fragment({ props, children }) {
  return { type: 'fragment', props, children };
}

export function h(tag, props, ...children) {
  const nodePointer = { current: null };
  const newProps = props || {};
  const newChildren = remakeChildren(nodePointer, children);
  const node = makeNode({ tag, props: newProps, children: newChildren });

  nodePointer.point = node;

  return node;
}

function redrawCustomComponent({ tag, props, children, prevVDom }) {
  const prevVDomKey = prevVDom.key;
  const newVDom = makeCustemElement({ tag, props, children, prevVDomKey });

  console.log('PREVVDOM - ', prevVDom);
  console.log('NEWVDOM  - ', newVDom);
}

function makeCustemElement({ tag, props, children, prevVDomKey }) {
  let prevVDom;
  let stateCallSeq = 0;
  const keyPrefix = tag.name;
  const vdomKey = prevVDomKey || `${keyPrefix}-${seq}`;
  const vdomLoopKey = props?.key;

  prevVDom = tag({
    props,
    children,
    useState: initValue => {
      const state = useState({
        initValue,
        vdomKey,
        stateCallSeq,
        render: () => {
          redrawCustomComponent({ tag, props, children, prevVDom });
        },
      });

      stateCallSeq += 1;

      return state;
    },
  });

  prevVDom.key = vdomKey;
  if (vdomLoopKey) {
    prevVDom.loopKey = vdomLoopKey;
  }

  seq += 1;

  return prevVDom;
}

function makeNode({ tag, props, children }) {
  const isFragment = typeof tag === 'function' && tag.name === 'Fragment';
  const isCustemComponent =
    typeof tag === 'function' && tag.name !== 'Fragment';

  if (isFragment) {
    return Fragment({ props, children });
  } else if (isCustemComponent) {
    return makeCustemElement({ tag, props, children });
  }

  return { type: 'element', tag, props, children };
}

function remakeChildren(nodePointer, children) {
  return children.map(item => {
    const childItem = makeChildrenItem({ item });

    return {
      ...childItem,
      getParent: () => nodePointer.current,
      getBrothers: () => nodePointer.point.current,
    };
  });
}

function makeChildrenItem({ item }) {
  if (!item) {
    return { type: null };
  } else if (Array.isArray(item)) {
    return { type: 'loop', children: item };
  } else if (typeof item === 'string' || typeof item === 'number') {
    return { type: 'text', text: item };
  }

  return item;
}
