import { useState } from './hook';
import makeNewVdomTree from './diff';
import { vDomUpdate } from './render';
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

function redrawCustomComponent({ tag, props, children, prevVDom }) {
  NEED_DIFF = true;

  const newVDomRenderer = makeCustemNode({ tag, props, children });

  const newVdomTree = makeNewVdomTree({
    originalVdom: prevVDom,
    newVdom: newVDomRenderer,
  });

  newVdomTree.getBrothers = prevVDom.getBrothers;
  newVdomTree.getParent = prevVDom.getParent;

  const brothers = newVdomTree.getBrothers();
  const index = brothers.indexOf(prevVDom);

  brothers.splice(index, 1, newVdomTree);

  console.log('PREVVDOM - ', prevVDom);
  // console.log('NEWVDOMTREE - ', newVdomTree);
  vDomUpdate(newVdomTree);

  NEED_DIFF = false;
}

function makeCustemNode({ tag, props, children }) {
  const resolve = stateKey => {
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

  resolve.tagName = tag.name;

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
