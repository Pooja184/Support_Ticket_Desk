import { Router } from "express";
import { addTicket, addTicketAttachment } from "../controllers/ticket.controller.js";
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
export default ticketRouter;
