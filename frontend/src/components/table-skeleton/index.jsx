/* eslint-disable react/prop-types */
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from(Array(rows).keys()).map((item) => (
        <div key={item} className="h-8 animate-pulse rounded bg-neutral-300" />
      ))}
    </div>
  );
};
