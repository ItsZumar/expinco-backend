import { PaginationI } from "../../../../middleware/paginate";
import { TransactionDocument } from "../../model/transaction.model";

export type ListTransactionI = {
  data: Array<TransactionDocument>;
  pagination: PaginationI;
};
export type CreateTransactionI = TransactionDocument & {};
export type UpdateTransactionI = TransactionDocument & {};
export type DeleteTransactionI = { status: string };
