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
 */

function checkFragment(vDom) {
  return typeof vDom === 'function' && tag.name === 'Fragment';
}

function checkCustemComponent(vDom) {
  return typeof tag === 'function' && tag.name !== 'Fragment';
}

function checkSameCustomComponent(originalVdom, newVdom) {
  return newVdom.tagName === originalVdom.tagName;
}

function checkSameFragment({ originalVdom, newVdom }) {
  return (
    originalVdom.type === 'fragment' &&
    originalVdom.children.length === newVdom.children.length
  );
}

function checkSameElement(originalVdom, newVdom) {
  return originalVdom.type === 'element' && newVdom.tag === originalVdom.tag;
}

export default function vDomDiff({ originalVdom, newVdom }) {
  const isComponent = checkCustemComponent(newVdom);
  const isFragment = checkFragment(newVdom);

  if (isComponent) {
    processingComponent({ originalVdom, newVdom });
  } else if (isFragment) {
    processingFragment({ originalVdom, newVdom });
  }
}

function processingFragment({ originalVdom, newVdom }) {
  const isSameFragment = checkSameFragment({ originalVdom, newVdom });

  console.log('ISSAMEFRAGMENT = ', isSameFragment);
}

function processingComponent({ originalVdom, newVdom }) {
  const isRoot = renderCount === 0;
  const isSameCustomComponent =
    checkSameCustomComponent(originalVdom, newVdom) || isRoot;

  if (!originalVdom || !isSameCustomComponent) {
    newVdom = newVdom();
    newVdom.children.forEach((item, index) => {
      vDomDiff({ newVdom: item });
    });
  } else if (isSameCustomComponent && originalVdom) {
    newVdom = newVdom(originalVdom.stateKey);
    newVdom.children.forEach((item, index) => {
      vDomDiff({ newVdom: item, originalVdom: originalVdom[index] });
    });
  }
}
