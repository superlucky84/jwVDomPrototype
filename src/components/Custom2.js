import { h, Fragment } from '../jsx';

export default function Custom2({ props = {}, children, useState }) {
  const [j] = useState(10);
  const { number } = props;

  return (
    <div class="custom2">
      {number} - {j} - a<article>{children}</article>
    </div>
  );
}
