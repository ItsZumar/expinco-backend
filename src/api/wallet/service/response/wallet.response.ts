import { WalletDocument } from "../../model/wallet.model";

export type AddWalletI = WalletDocument & {};
export type UpdateWalletI = WalletDocument & {};
export type DeleteWalletI = { status: string };
