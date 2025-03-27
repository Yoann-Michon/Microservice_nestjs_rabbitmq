export interface IEvent {
  id?: number; 
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  address: string;
  maxCapacity: number;
  availableSeat: number;
  createdBy: string;
  creationDate: Date;
  isActive: boolean;
  price : number;
  images: string[];
}

