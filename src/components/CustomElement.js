import { h, Fragment } from '../jsx';
import Custom2 from './Custom2';

export default function CustomElement({ props, children }) {
  let v = 7;
  let j = 7;
  // const [j, setJ] = useState(3);

  const handle = () => {
    console.log('a');
    setJ(j + 1);
  };

  return (
    <div class="jj">
      {v === 9 ? <section>a</section> : null}
      <span onClick={handle}>
        {v}-{j}-vava
      </span>
    </div>
  );
}
