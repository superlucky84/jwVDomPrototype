/**
 * Jw 가상돔 diff 알고리즘 정책
 *
 * 1. 하위 노드 통째로 교체해 버려야 되는경우
 *   v 1-1. 태그이름 또는 컴포넌트 이름이 다를때
 *   1-2. 자식 노드의 개수가 틀릴때 (Fragment일 경우 컴포넌트 이름으로 체크가 안되므로)
 *    1-2-1. 같다면 children을 루프톨면서 배교해줌
 *   v 1-3. 부모 엘리먼트의 태그이름이 다를때
 * 2. 1번에 해당하지 않을 경우 props와 데이터만 일단 교체
 * 3. props와 data가 오리지날 가상돔과 얕은비교를 통해 완전히 같다면 children을 교체하지 않고 끝냄 (일단 구현 생략)
 * 4. props와 datark 오리지날 가상동과 얕은비교를 통해 틀리다면 children을 루프톨면서 배교해줌 (일단 구현생략)
 * 5. loop 타입은 일단 항상 다시 그리고 나중에 개선 (일단 구현 생략)
 */

export default function makeNewVdomTree({ originalVdom, newVdom }) {
  const isComponent = checkCustemComponent(newVdom);
  const isFragment = checkFragment(newVdom);
  const isTagElement = checkTagElement(newVdom);
  const isLoopElement = checkLoopElement(newVdom);

  if (isComponent) {
    processingComponent({ originalVdom, newVdom });
  } else if (isFragment) {
    processingFragment({ originalVdom, newVdom });
  } else if (isTagElement) {
    processingTagElement({ originalVdom, newVdom });
  } else if (isLoopElement) {
    processingLoopElement({ originalVdom, newVdom });
  }
}

function processingComponent({ originalVdom, newVdom }) {
  const isSameCustomComponent = checkSameCustomComponent(originalVdom, newVdom);

  if (!originalVdom || !isSameCustomComponent) {
    newVdom = newVdom();
    newVdom.children.forEach(item => {
      makeNewVdomTree({ newVdom: item });
    });
  } else if (originalVdom && isSameCustomComponent) {
    newVdom = newVdom(originalVdom.stateKey);
    newVdom.children.forEach((item, index) => {
      makeNewVdomTree({ newVdom: item, originalVdom: originalVdom[index] });
    });
  }
}

/**
 * 루프형은 우선 무조건 새로 만듬
 * 추후 키값 있을때는 원본 엘리먼트를 유지하도록 개선 예정
 */
function processingLoopElement({ originalVdom, newVdom }) {
  newVdom.children.forEach(item => {
    makeNewVdomTree({ newVdom: item });
  });
}

function processingTagElement({ originalVdom, newVdom }) {
  const isSameTagElement = checkSameTagElement({ originalVdom, newVdom });

  if (!originalVdom || !isSameTagElement) {
    newVdom.children.forEach(item => {
      makeNewVdomTree({ newVdom: item });
    });
  } else if (originalVdom && isSameTagElement) {
    newVdom.children.forEach((item, index) => {
      makeNewVdomTree({ newVdom: item, originalVdom: originalVdom[index] });
    });
  }
}

function processingFragment({ originalVdom, newVdom }) {
  const isSameFragment = checkSameFragment({ originalVdom, newVdom });

  if (!originalVdom || !isSameFragment) {
    newVdom.children.forEach(item => {
      makeNewVdomTree({ newVdom: item });
    });
  } else if (originalVdom && isSameFragment) {
    newVdom.children.forEach((item, index) => {
      makeNewVdomTree({ newVdom: item, originalVdom: originalVdom[index] });
    });
  }
}

function checkCustemComponent(vDom) {
  return typeof vDom === 'function';
}

function checkFragment(vDom) {
  return vDom.type === 'fragment';
}

function checkTagElement(vDom) {
  return vDom.type === 'element';
}

function checkLoopElement(vDom) {
  return vDom.type === 'loop';
}

function checkSameCustomComponent(originalVdom, newVdom) {
  return newVdom.tagName === originalVdom?.tagName;
}

function checkSameFragment({ originalVdom, newVdom }) {
  return (
    originalVdom.type === 'fragment' &&
    originalVdom.children.length === newVdom.children.length
  );
}

function checkSameTagElement({ originalVdom, newVdom }) {
  return originalVdom?.type === 'element' && originalVdom?.tag === newVdom.tag;
}
