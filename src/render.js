import { addKey } from './keyManager';
export function render(vDom, wrapElement) {
  // addKey(vDom);
  // console.log(vDom);
  wrapElement.appendChild(vDomToDom(vDom));
}

export function vDomUpdate(newVdomTree) {
  const { needRerender } = newVdomTree;

  // console.log('NEWVDOMTREE - ', newVdomTree);
  // console.log('NEEDRERENDER - ', needRerender);

  // ADD, DELETE, DELETE-ADD, UPDATE, NONE
  switch (needRerender) {
    case 'ADD':
      break;
    case 'DELETE':
      break;
    case 'DELETE-ADD':
      typeDeleteAdd(newVdomTree);
      break;
    case 'UPDATE':
      typeUpdate(newVdomTree);
      break;
    case 'NONE':
      break;
  }
}

function typeDeleteAdd(newVdom) {
  console.log('DELTE-ADD', newVdom);

  // const parentVdom = newVdom.getParent();
  // const parentDiv = parentVdom.el;
  // const newElement = vDomToDom(newVdom);
  const element = newVdom.el;

  if (element && newVdom.oldProps) {
    removeEvent(newVdom.oldProps, element);
  }
  // console.log('parentEL - ', parentVdom.el);

  // console.log('1111', newVdom.getParent());
  // console.log('ELEMENT - ', newVdom);

  // console.log('-------------------------');
  // console.log(newVdom.el);
  element.nodeValue = newVdom.text;

  // parentDiv.replaceChild(newVdom.el, newElement);
}

function typeUpdate(newVdom) {
  const element = newVdom.el;

  if (element) {
    removeEvent(newVdom.oldProps, element);
    updateProps(newVdom.props, element);

    delete newVdom.oldProps;
  }

  newVdom.children.forEach(childItem => {
    vDomUpdate(childItem);
  });
}

function removeEvent(oldProps, element) {
  if (oldProps.onClick) {
    element.removeEventListener('click', oldProps.onClick);
  }
}

function updateProps(props, element) {
  Object.entries(props).forEach(([dataKey, dataValue]) => {
    if (dataKey === 'style') {
      addStyle(vDom, element);
    } else if (dataKey === 'onClick') {
      console.log('KK - ', element.onclick);
      element.addEventListener('click', dataValue);
    } else {
      element.setAttribute(dataKey, dataValue);
    }
  });
}

function vDomToDom(vDom) {
  let element;
  const { type, tag, text, props, children = [] } = vDom;

  if (type === 'fragment' || type === 'loop') {
    element = new DocumentFragment();
  } else if (type === 'element') {
    element = document.createElement(tag);
  } else if (type === 'text') {
    element = document.createTextNode(text);
  }

  const elementChildren = children.reduce((acc, childItem) => {
    if (childItem.type) {
      const a = vDomToDom(childItem);
      acc.appendChild(a);
    }

    return acc;
  }, new DocumentFragment());

  if (props) {
    updateProps(props, element);
  }

  if (elementChildren.hasChildNodes()) {
    element.appendChild(elementChildren);
  }

  vDom.el = element;
  return element;
}

function addStyle(vDom, element) {
  const { style = {} } = vDom.props;
  Object.entries(style).forEach(([styleKey, dataValue]) => {
    element.style[styleKey] = dataValue;
  });
}
