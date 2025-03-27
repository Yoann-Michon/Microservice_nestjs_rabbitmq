import { ITicket } from "./Ticket.interface";

export interface IUser {
  id?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  role?: "USER" | "ADMIN" |"EVENTCREATOR";
  bookings?: ITicket[];
}
