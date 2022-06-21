import { h, Fragment } from '../jsx';
import Custom2 from './Custom2';

export default function CustomElement({ props, children, useState }) {
  const [j, setJ] = useState(3);
  const handle = () => {
    setJ(j + 1);
  };

  return (
    <div class="jj">
      <span onClick={handle}>{j}-vava</span>
      <Custom2 k={j} />
      <Custom2 />
      <div>
        <span>1</span>
        <span>2</span>
      </div>
    </div>
  );
}
