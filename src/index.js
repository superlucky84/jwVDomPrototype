function jsx(tag, props, ...children) {
  const newChildren = children.map(item => makeChildren(item));

  return {
    tag,
    props,
    children: newChildren,
  };
}

function makeChildren(item) {
  if (typeof item === 'string') {
    return {
      text: item,
    };
  }

  return item;
}

function addStyle(vDom, element) {
  const { style = {} } = vDom.props;
  Object.entries(style).forEach(([styleKey, dataValue]) => {
    element.style[styleKey] = dataValue;
  });
}

function vDomToDom(vDom, wrapElement) {
  let element = wrapElement;
  const { tag, text, props, children = [] } = vDom;

  if (tag) {
    element = document.createElement(tag);
  }

  if (text) {
    const newText = document.createTextNode(text);
    element.appendChild(newText);
  }

  children.forEach(childItem => {
    vDomToDom(childItem, element);
  });

  if (element && element !== wrapElement) {
    if (props) {
      Object.entries(props).forEach(([dataKey, dataValue]) => {
        if (dataKey === 'style') {
          addStyle(vDom, element);
        } else {
          element.setAttribute(dataKey, dataValue);
        }
      });
    }

    wrapElement.appendChild(element);
  }
}

const v = 'j';
const w = 'kkk';
const n = '3';

const node = (
  <div va={n} style={{ fontWeight: 'bold' }}>
    <span>3ll</span>
    <span>
      3lll{w}
      <b> 7 </b>3www
    </span>
    ss{v}ss
  </div>
);

const resultElement = document.createElement('div');

console.log('NODE = ', node);

vDomToDom(node, resultElement);

document.body.appendChild(resultElement);

export default {
  node,
};
