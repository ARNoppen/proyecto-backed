import { Router } from "express";
import TicketManager from "../service/TicketManager.js";
import { formatDateTime } from "../utils.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
const ticketManager = new TicketManager();

// GET: obtener ticket por ID
router.get("/:tid", authMiddleware, async (req, res) => {
  try {
    const ticketId = req.params.tid;
    const ticket = await ticketManager.getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket no encontrado" });
    }

    const formattedDateTime = formatDateTime(ticket.purchase_datetime);

    res.json({
      success: true,
      payload: {
        ...ticket._doc,
        purchase_datetime: formattedDateTime
      }
    });
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ success: false, error: "Error interno al obtener el ticket" });
  }
});

export default router;