import { h, Fragment } from '../jsx';
import Custom2 from './Custom2';

function jj() {
  console.log('THIS', this);
}

export default function CustomElement({ props, children, useState }) {
  let v = 7;
  const [j, setJ] = useState(3);
  jj();

  const handle = () => {
    setJ(j + 1);
  };

  return (
    <div class="jj">
      <span onClick={handle}>{j}-vava</span>
      <Custom2 />
    </div>
  );
}
