import { h, Fragment } from '../jsx';

export default function Custom2({ props, children }) {
  const j = 7;

  return (
    <div class="custom2">
      {j} - a{props.k}
      <article>{children}</article>
    </div>
  );
}
