import { h, Fragment } from '../jsx';

export default function CustomElement() {
  let v = 'j';
  let w = 'kkk';
  var handle = () => {
    console.log('k');
  };

  return (
    <>
      <span onClick={handle}>3ll</span>
      <span>
        3lll{w} {v}
        <b> 8 </b>
      </span>
    </>
  );
}
