import TicketDAO from "../dao/mongo/TicketDAO.js";

export default class TicketRepository {
    constructor() {
      this.ticketDAO = new TicketDAO();
    }
  
    async createTicket(ticketData) {
      try {
        return await this.ticketDAO.createTicket(ticketData);
      } catch (error) {
        console.error("Error en TicketRepository al crear ticket:", error);
        throw error;
      }
    }
  
    async getTicketById(ticketId) {
      try {
        return await this.ticketDAO.getTicketById(ticketId);
      } catch (error) {
        console.error("Error en TicketRepository al obtener ticket por ID:", error);
        throw error;
      }
    }
  
    async getAllTickets() {
      try {
        return await this.ticketDAO.getAllTickets();
      } catch (error) {
        console.error("Error en TicketRepository al obtener todos los tickets:", error);
        throw error;
      }
    }
  }