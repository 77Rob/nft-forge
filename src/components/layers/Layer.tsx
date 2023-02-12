const Layer = ({ layer, id }: { layer: string; id: number }) => {
  return (
    <div>
      <h1>{layer}</h1>
      <h2>{id}</h2>
    </div>
  );
};

export default Layer;
