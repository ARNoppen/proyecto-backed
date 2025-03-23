import { ticketModel } from "../models/ticket.model.js";

export default class TicketDAO {
    async createTicket(ticketData) {
      try {
        const newTicket = await ticketModel.create(ticketData);
        return newTicket;
      } catch (error) {
        console.error("Error en TicketDAO al crear ticket:", error);
        throw error;
      }
    }
  
    async getTicketById(ticketId) {
      try {
        return await ticketModel.findById(ticketId).exec();
      } catch (error) {
        console.error("Error en TicketDAO al obtener ticket por ID:", error);
        throw error;
      }
    }
  
    async getAllTickets() {
      try {
        return await ticketModel.find().exec();
      } catch (error) {
        console.error("Error en TicketDAO al obtener todos los tickets:", error);
        throw error;
      }
    }
  }