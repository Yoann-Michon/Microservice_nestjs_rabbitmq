export interface IPayment {
    id: number;
    amount: number;
    method: string;
    paymentDate: Date;
    ticketId: number;
  }
  