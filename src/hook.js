let value = {};

const useState = ({ initValue, vdomKey, stateCallSeq, render }) => {
  const currentSubSeq = stateCallSeq;

  if (!value[vdomKey] || !value[vdomKey][currentSubSeq]) {
    value[vdomKey] ??= {};
    value[vdomKey][currentSubSeq] ??= {};
    value[vdomKey][currentSubSeq] = initValue;
  }

  const setData = newValue => {
    value[vdomKey][currentSubSeq] = newValue;
    render();
  };

  return [value[vdomKey][currentSubSeq], setData];
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
