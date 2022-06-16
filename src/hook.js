let value = {};

export const useState = ({ initValue, stateKey, stateCallSeq, render }) => {
  const currentSubSeq = stateCallSeq;

  if (!value[stateKey] || !value[stateKey][currentSubSeq]) {
    value[stateKey] ??= {};
    value[stateKey][currentSubSeq] ??= {};
    value[stateKey][currentSubSeq] = initValue;
  }

  const setData = newValue => {
    value[stateKey][currentSubSeq] = newValue;
    render();
  };

  return [value[stateKey][currentSubSeq], setData];
};

/*
useState: initValue => {
  const state = useState({
    initValue,
    stateCallSeq,
    render: () => {
      redrawCustomComponent({ tag, props, children, prevVDom });
    },
  });

  stateCallSeq += 1;

  return state;
},

function redrawCustomComponent({ tag, props, children, prevVDom }) {
  const newVDom = makeCustemElement({ tag, props, children });

  console.log('PREVVDOM - ', prevVDom);
  console.log('NEWVDOM  - ', newVDom);
}
*/
