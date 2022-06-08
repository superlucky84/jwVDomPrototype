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

function addStyle(vDom, element) {
  const { style = {} } = vDom.props;
  Object.entries(style).forEach(([styleKey, dataValue]) => {
    element.style[styleKey] = dataValue;
  });
}

export function vDomToDom(vDom) {
  const { type, tag, text, props, children = [] } = vDom;
  let element;

  if (type === 'fragment') {
    element = new DocumentFragment();
  } else if (type === 'element') {
    element = document.createElement(tag);
  } else if (type === 'text') {
    element = document.createTextNode(text);
  }

  const elementChildren = children.reduce((acc, childItem) => {
    const a = vDomToDom(childItem);
    acc.appendChild(a);

    return acc;
  }, new DocumentFragment());

  if (props) {
    Object.entries(props).forEach(([dataKey, dataValue]) => {
      if (dataKey === 'style') {
        addStyle(vDom, element);
      } else {
        element.setAttribute(dataKey, dataValue);
      }
    });
  }

  if (elementChildren.hasChildNodes()) {
    element.appendChild(elementChildren);
  }

  return element;
}
