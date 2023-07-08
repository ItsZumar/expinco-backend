import { PaginationI } from "../../../../middleware/paginate";

export type SpendFrequencyI = {
  data: number[];
  label: (string | number)[];
};
