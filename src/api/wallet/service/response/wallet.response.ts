import { IPagination } from "../../../../middleware/paginate";
import { WalletDocument } from "../../model/wallet.model";

export type ListWalletI = {
    data: Array<WalletDocument>
    pagination: IPagination
};

export type AddWalletI = WalletDocument & {};
export type UpdateWalletI = WalletDocument & {};
export type DeleteWalletI = { status: string };
