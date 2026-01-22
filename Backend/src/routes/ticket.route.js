import { Router } from "express";
import { addComment, addTicket, addTicketAttachment, getComments, getMyTickets } from "../controllers/ticket.controller.js";
import { tokenDecoder } from "../middlewares/tokenDecoder.js";
import { upload } from "../config/multer.js";

const ticketRouter = Router();

ticketRouter.post("/add-ticket", tokenDecoder, addTicket);
ticketRouter.post(
  "/:id/attachments",
  tokenDecoder,
  upload.single("file"),
  addTicketAttachment,
);

ticketRouter.get("/my-tickets",tokenDecoder,getMyTickets)

ticketRouter.post("/:id/comments",tokenDecoder,addComment)
ticketRouter.get("/:id/comments",tokenDecoder,getComments)

export default ticketRouter;
