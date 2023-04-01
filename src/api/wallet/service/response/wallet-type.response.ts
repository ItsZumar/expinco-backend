import { IPagination } from "../../../../middleware/paginate";
import { WalletTypeDocument } from "../../model/wallet-type.model";

export type ListWalletTypeI = {
  data: Array<WalletTypeDocument>;
  pagination: IPagination;
};
export type AddWalletTypeI = WalletTypeDocument & {};
export type UpdateWalletTypeI = WalletTypeDocument & {};
export type DeleteWalletTypeI = WalletTypeDocument & {};
