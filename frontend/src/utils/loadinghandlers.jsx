import { TableSkeleton } from "../components/table-skeleton";

export const loadingHandler = (isLoading, table) => {
  return isLoading ? <TableSkeleton /> : table;
};
