import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy} from '@nestjs/microservices';

@Injectable()
export class TicketService {
  
constructor(@Inject("TICKET_SERVICE") private readonly ticketServiceClient: ClientProxy,
    ) { }

    async createTicket(event: any, user: any) {
        return await this.ticketServiceClient.send('createTicket', { event, user }).toPromise();
    }
    
    
    async updateTicket(id: number, ticketData: any, user: any) {
      return await this.ticketServiceClient.send('updateTicket', { 
        updateTicketDto: { id, ...ticketData }, 
        user 
      }).toPromise();
    }
    
    
      async processPayment(paymentData:any , user:any){
        return await this.ticketServiceClient.send('processPayment', {
          paymentData,
          user
        }).toPromise();
      }
    
      async validateTicket(id: number,user:any){
        return await this.ticketServiceClient.send('validateTicket', {id,user}).toPromise();
      }
    
      async findTicketById(id: number,user:any){
        return await this.ticketServiceClient.send('findTicketById', {id,user}).toPromise();
      }
    
      async findUserTickets(user:any){
        return await this.ticketServiceClient.send('findUserTickets', user).toPromise();
      }
    
      async findEventTickets(id: number,user:any){
        return await this.ticketServiceClient.send('findEventTickets', {id,user}).toPromise();
      }

    async deleteTicket(id:number,user:any){
        return await this.ticketServiceClient.send("deleteTicket",{id,user}).toPromise();
    }
}