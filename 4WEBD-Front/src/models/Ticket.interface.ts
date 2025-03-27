import { IPayment } from "./Payment.interface";


export interface ITicket {
  id: number;  
  userId: number;
  eventId: number;
  ticketNumber: number;
  status: string;
  payments: IPayment[];
}