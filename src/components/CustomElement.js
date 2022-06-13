import { h, Fragment } from '../jsx';

export default function CustomElement({ props = {}, children, useState }) {
  let v = 3;
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
    </div>
  );
}
