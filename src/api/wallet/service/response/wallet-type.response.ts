import { IPagination } from "../../../../middleware/paginate";
import { WalletTypeDocument } from "../../model/wallet-type.model";

export interface ListWalletTypeReq extends Request {
  result: ListWalletTypeI;
}

export type ListWalletTypeI = {
  data: WalletTypeDocument[];
  pagination: IPagination;
};
export type AddWalletTypeI = WalletTypeDocument & {};
export type UpdateWalletTypeI = WalletTypeDocument & {};
export type DeleteWalletTypeI = WalletTypeDocument & {};
