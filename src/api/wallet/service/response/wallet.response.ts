import { PaginationI } from "../../../../middleware/paginate";
import { WalletDocument } from "../../model/wallet.model";

export type ListWalletI = {
    data: Array<WalletDocument>
    pagination: PaginationI
};

export type AddWalletI = WalletDocument & {};
export type UpdateWalletI = WalletDocument & {};
export type DeleteWalletI = { status: string };
