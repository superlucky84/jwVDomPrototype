export function addKey(vDom) {
  add(vDom, '0');
}

function add(targetNode, keyString) {
  const { children = [] } = targetNode;
  targetNode.key = keyString;

  children.forEach((childNode, index) => {
    const childKeyString = `${keyString}-${index}`;
    add(childNode, childKeyString);
  });
}
