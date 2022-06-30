import useData from '../useData';

export default function NewStyleComponent() {
  const data = useData({
    a: 1,
    b: 2,
  });

  const handle = () => {
    data.a = 7;
    data.b = 8;
  };

  return {
    render: () => (
      <Fragment>
        <div onClick={handle}>{data.a}</div>
        <div>{data.b}</div>
      </Fragment>
    ),
  };
}
