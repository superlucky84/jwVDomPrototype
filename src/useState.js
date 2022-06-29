import { makeState } from './hook';

export const stateCallSeq = { value: null };
export const stateKeyRef = { value: null };
export const componentKeyMap = {};

export default function useState(initValue) {
  const sKey = stateKeyRef.value;
  const state = makeState({
    initValue,
    stateCallSeq: stateCallSeq.value,
    stateKey: sKey,
    render: () => {
      componentKeyMap[sKey]();
    },
  });

  stateCallSeq.value += 1;

  return state;
}
