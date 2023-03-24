import { Request } from "express";
import { ListWalletTypeI } from "../response/wallet-type.response";

export interface ListWalletTypeReqI extends Request {
  result: ListWalletTypeI;
}
