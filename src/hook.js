let value = {};

export const makeState = ({ initValue, stateKey, stateCallSeq, render }) => {
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

  console.log('VALUEEEE', value);

  return [value[stateKey][currentSubSeq], setData];
};
