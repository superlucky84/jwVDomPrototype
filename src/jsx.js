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

function makeCustemElement({ tag, props, children }) {
  return tag({ props, children });
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
