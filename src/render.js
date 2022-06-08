export function render(vDom, wrapElement) {
  wrapElement.appendChild(vDomToDom(vDom));
}

function vDomToDom(vDom) {
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
      } else if (dataKey === 'onClick') {
        element.addEventListener('click', dataValue);
      } else {
        element.setAttribute(dataKey, dataValue);
      }
    });
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
