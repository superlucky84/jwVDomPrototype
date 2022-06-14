import { h, Fragment } from '../jsx';
import Custom2 from './Custom2';

export default function CustomElement({ props = {}, children, useState }) {
  let v = 7;
  const [j, setJ] = useState(3);

  const handle = () => {
    console.log('a');
    setJ(j + 1);
  };

  return (
    <div class="jj">
      <span onClick={handle}>
        {v}-{j}-vava
      </span>
      {[1, 2, 3].map(item => (
        <Custom2 key={item} number={item} />
      ))}
    </div>
  );
}
