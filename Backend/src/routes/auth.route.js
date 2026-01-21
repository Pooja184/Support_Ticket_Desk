import { Router } from "express";
import { getCurrentUser, login, register } from "../controllers/auth.controller.js";
import { tokenDecoder } from "../middlewares/tokenDecoder.js";

const authRouter=Router();

authRouter.post("/signup",register)
authRouter.post("/login",login)
authRouter.get("/current-user",tokenDecoder,getCurrentUser)

export default authRouter;