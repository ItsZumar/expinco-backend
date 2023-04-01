import { TransactionCategoryDocument } from "../../model/transactionCategory.model";
import { PaginationI } from "../../../../middleware/paginate";

export type ListCategoryI = {
  data: Array<TransactionCategoryDocument>;
  pagination: PaginationI;
};
export type CreateCategoryI = TransactionCategoryDocument & {};
export type UpdateCategoryI = TransactionCategoryDocument & {};
export type DeleteCategoryI = { status: string };
