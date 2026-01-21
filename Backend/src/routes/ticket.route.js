import { Router } from "express";
import { addTicket } from "../controllers/ticket.controller.js";
import { tokenDecoder } from "../middlewares/tokenDecoder.js";


const ticketRouter=Router();

ticketRouter.post('/add-ticket',tokenDecoder,addTicket)

export default ticketRouter