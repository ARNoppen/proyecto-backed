import TicketRepository from "../repositories/TicketRepository.js";

export default class TicketManager {
    constructor() {
      this.ticketRepository = new TicketRepository();
    }
  
    async createTicket(ticketData) {
      try {
        return await this.ticketRepository.createTicket(ticketData);
      } catch (error) {
        console.error("Error en TicketManager al crear ticket:", error);
        throw error;
      }
    }
  
    async getTicketById(ticketId) {
      try {
        return await this.ticketRepository.getTicketById(ticketId);
      } catch (error) {
        console.error("Error en TicketManager al obtener ticket por ID:", error);
        throw error;
      }
    }
  
    async getAllTickets() {
      try {
        return await this.ticketRepository.getAllTickets();
      } catch (error) {
        console.error("Error en TicketManager al obtener todos los tickets:", error);
        throw error;
      }
    }
  }