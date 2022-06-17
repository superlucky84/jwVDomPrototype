import { useState } from './hook';
import diff from './diff';
let NEED_DIFF = false;
let renderDepth = 0;
let RERENDER_STACK = [];

export function Fragment({ props, children }) {
  return { type: 'fragment', props, children };
}
export function h(tag, props, ...children) {
  const nodePointer = { current: null };
  const newProps = props || {};
  const newChildren = remakeChildren(nodePointer, children);
  const node = makeNode({ tag, props: newProps, children: newChildren });

  nodePointer.current = node;

  return node;
}

function redrawCustomComponent({ tag, props, children, prevVDom, stateKey }) {
  NEED_DIFF = true;

  const newVDom = makeCustemNode({ tag, props, children, stateKey })();

  // 비교
  console.log('PREVVDOM - ', prevVDom);
  console.log('NEWVDOM  - ', newVDom);
  console.log('CHILDREN - ', newVDom.children);

  NEED_DIFF = false;
}

function makeCustemNode({ tag, props, children, stateKey }) {
  const resolve = () => {
    let stateCallSeq = 0;
    if (!stateKey) {
      stateKey = Symbol();
    }
    const customNode = tag({
      props,
      children,
      useState: initValue => {
        const state = useState({
          initValue,
          stateCallSeq,
          stateKey,
          render: () => {
            redrawCustomComponent({
              tag,
              props,
              children,
              prevVDom: customNode,
              stateKey,
            });
          },
        });

        stateCallSeq += 1;

        return state;
      },
    });

    customNode.tagName = tag.name;
    customNode.stateKey = stateKey;

    return customNode;
  };

  return resolve;
}

function makeNode({ tag, props, children }) {
  const isFragment = typeof tag === 'function' && tag.name === 'Fragment';
  const isCustemComponent =
    typeof tag === 'function' && tag.name !== 'Fragment';

  if (isFragment) {
    return Fragment({ props, children });
  } else if (isCustemComponent) {
    const makeComponent = makeCustemNode({ tag, props, children });

    if (NEED_DIFF) {
      makeComponent.tagName = tag.name;

      return makeComponent;
    }

    return makeComponent();
  }

  return { type: 'element', tag, props, children };
}

function makeChildrenItem({ item }) {
  if (!item) {
    return { type: null };
  } else if (Array.isArray(item)) {
    const nodePointer = { current: null };
    const children = remakeChildren(nodePointer, item);
    const node = { type: 'loop', children };
    nodePointer.current = node;

    return node;
  } else if (typeof item === 'string' || typeof item === 'number') {
    return { type: 'text', text: item };
  }

  return item;
}

function remakeChildren(nodePointer, children) {
  return children.map(item => {
    const childItem = makeChildrenItem({ item });
    childItem.getParent = () => nodePointer.current;
    childItem.getBrothers = () => nodePointer.current.children;

    return childItem;
  });
}
