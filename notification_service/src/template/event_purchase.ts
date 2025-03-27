export const ticketPurchaseTemplate = (eventName: string, eventDate: string, customerName: string, ticketPrice: number,  ticketNumber: string) => {
    return `
      <html>
        <body>
          <h1>Ticket Purchase Confirmation</h1>
          <p>Hello ${customerName},</p>
          <p>Thank you for purchasing a ticket for the event "<strong>${eventName}</strong>".</p>
          <p><strong>Ticket Number:</strong> ${ ticketNumber}</p>
          <p><strong>Event Date:</strong> ${eventDate}</p>
          <p><strong>Ticket Price:</strong> ${ticketPrice} €</p>
          <p>We hope you enjoy the event!</p>
          <p>Best regards,</p>
          <p>Event Management Team</p>
        </body>
      </html>
    `;
  };