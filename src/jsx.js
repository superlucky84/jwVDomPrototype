export function Fragment(props, children) {
  return {
    type: 'fragment',
    props,
    children,
  };
}

export function h(tag, props, ...children) {
  const newChildren = children.map(item => makeChildren(item));

  if (typeof tag === 'function') {
    return tag(props, children);
  }

  return {
    type: 'element',
    tag,
    props,
    children: newChildren,
  };
}

function makeChildren(item) {
  if (typeof item === 'string') {
    return {
      type: 'text',
      text: item,
    };
  }

  return { type: 'element', ...item };
}
