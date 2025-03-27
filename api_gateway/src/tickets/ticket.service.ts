import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class TicketService {
  
constructor(@Inject("TICKET_SERVICE") private readonly ticketServiceClient: ClientProxy,
    ) { }

    async createTicket(event:any,user:any){
        return await this.ticketServiceClient.send('createTicket', {event,user}).toPromise();
      }
    
     async updateTicket(
        id: number,
        ticketData:any,
        user:any
      ){
        return await this.ticketServiceClient.send('updateTicket', ticketData).toPromise();
      }
    
      async processPayment(payload: { 
        ticketId: number, 
        amount: number, 
        user: any, 
        event: any 
      }){
        return await this.ticketServiceClient.send('processPayment', payload).toPromise();
      }
    
      async validateTicket(id: number,user:any){
        return await this.ticketServiceClient.send('validateTicket', {id,user}).toPromise();
      }
    
      async findTicketById(id: number,user:any){
        return await this.ticketServiceClient.send('findTicketById', {id,user}).toPromise();
      }
    
      async findUserTickets(userId: number){
        return await this.ticketServiceClient.send('findUserTickets', userId).toPromise();
      }
    
      async findEventTickets(id: number,user:any){
        return await this.ticketServiceClient.send('findEventTickets', {id,user}).toPromise();
      }

    async deleteTicket(id:number,user:any){
        return await this.ticketServiceClient.send("",{id,user}).toPromise();
    }
}