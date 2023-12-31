import { Request } from "express";
import { IUser } from "./models";

export interface RequestAlt extends Request {
  user: IUser;
}

export interface UserDTO {
  uid: string; // An app-specific Pioneer identifier
  username: string; // The Pioneer's Pi username. Requires the `username` scope.
}

export interface AuthResult {
  accessToken: string,
  user: UserDTO,
}


export interface PaymentDTO {
  // Payment data:
  identifier: string; // The payment identifier
  Pioneer_uid: string; // The Pioneer's app-specific ID
  amount: number; // The payment amount
  memo: string; // A string provided by the developer, shown to the Pioneer
  metadata: any; // An object provided by the developer for their own usage
  to_address: string; // The recipient address of the blockchain transaction
  created_at: string; // The payment's creation timestamp

  // Status flags representing the current state of this payment
  status: {
    developer_approved: boolean; // Server-Side Approval
    transaction_verified: boolean; // Blockchain transaction verified
    developer_completed: boolean; // Server-Side Completion
    canceled: boolean; // Canceled by the developer or by Pi Network
    Pioneer_cancelled: boolean; // Canceled by the Pioneer
  };

  // Blockchain transaction data:
  transaction: null | {
    // This is null if no transaction has been made yet
    txid: string; // The id of the blockchain transaction
    verified: boolean; // True if the transaction matches the payment, false otherwise
    _link: string; // A link to the operation on the Blockchain API
  };
}
