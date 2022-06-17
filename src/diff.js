/**
 * Jw 가상돔 diff 알고리즘 정책
 *
 * 1. 하위 노드 통째로 교체해 버려야 되는경우
 *   v 1-1. 태그이름 또는 컴포넌트 이름이 다를때
 *   1-2. 자식 노드의 개수가 틀릴때 (Fragment일 경우 컴포넌트 이름으로 체크가 안되므로)
 *    1-2-1. 같다면 children을 루프톨면서 배교해줌
 *   v 1-3. 부모 엘리먼트의 태그이름이 다를때
 * 2. 1번에 해당하지 않을 경우 props와 데이터만 일단 교체
 * 3. props와 data가 오리지날 가상돔과 얕은비교를 통해 완전히 같다면 children을 교체하지 않고 끝냄
 * 4. props와 datark 오리지날 가상동과 얕은비교를 통해 틀리다면 children을 루프톨면서 배교해줌
 */

function checkFragment(vDom) {
  return typeof vDom === 'function' && tag.name === 'Fragment';
}

function checkCustemComponent(vDom) {
  return typeof tag === 'function' && tag.name !== 'Fragment';
}

function isSameCustomComponent(originalVdom, newVdom) {
  return newVdom.tagName === originalVdom.tagName;
}

function isSameFragment(originalVdom, newVdom) {}

function isSameElement(originalVdom, newVdom) {}

function isSameText(originalVdom, newVdom) {}

function isSameLoop(originalVdom, newVdom) {}

function isSameTag(originalVdom, newVdom) {
  // Custom component 일때
  if (checkCustemComponent(newVdom)) {
    return isSameCustomComponent(originalVdom, newVdom);
  }
  // Element 일때, Loop 일때
  else if (newVdom.type === 'element' || newVdom.type === 'loop') {
    return isSameElement(originalVdom, newVdom);
  }
  // text 일때
  else if (newVdom.type === 'text') {
    return isSameText(originalVdom, newVdom);
  }

  return true;
}
export default function vDomDiff(originalVdom, newVdom, renderCount) {
  const isRoot = renderCount === 0;
  const isSameTag = isSameTag(originalVdom, newVdom);
  const isSameVdom = isRoot || isSameTag;

  console.log(originalVdom, newVdom);

  if (!isSameVdom) {
    originalVdom = newVdom;
  }

  renderCount += 1;

  return renderCount;

  /*
  if (isSameVdom) {
    newVDom.children.map(item => {
      const isComponent = typeof item === 'function';

      if (isComponent) {
      } else {
      }
    });
  }
  */
}
