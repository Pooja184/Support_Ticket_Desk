import { Router } from "express";
import authRouter from "./auth.route.js";
import ticketRouter from "./ticket.route.js";

const mainRouter=Router();


mainRouter.use('/auth',authRouter)
mainRouter.use('/ticket',ticketRouter)

export default mainRouter