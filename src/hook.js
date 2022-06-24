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
