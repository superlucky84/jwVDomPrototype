let REDRAW = false;

export function Fragment({ props, children }) {
  return {
    type: 'fragment',
    props,
    children,
  };
}

function redrawCustomComponent({ tag, props, children, prevVDom }) {
  REDRAW = true;

  const newVDom = tag({ props, children, prevVDom, redraw: true });
  const brothers = prevVDom.getBrothers();
  newVDom.brothers = brothers;

  console.log('INDEX', brothers.indexOf(prevVDom));
  console.log('BROTHERS - ', brothers);

  REDRAW = false;
}

export function h(tag, props, ...children) {
  console.log('--', tag, REDRAW);
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
    let prevVDom;

    prevVDom = tag({
      props,
      children: newChildren,
      redrawCustomComponent: ({ props, children }) => {
        redrawCustomComponent({ tag, props, children, prevVDom });
      },
    });

    return prevVDom;
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
