import { Router } from "express";
import { getCurrentUser, login, logoutUser, register } from "../controllers/auth.controller.js";
import { tokenDecoder } from "../middlewares/tokenDecoder.js";

const authRouter=Router();

authRouter.post("/signup",register)
authRouter.post("/login",login)
authRouter.get("/current-user",tokenDecoder,getCurrentUser)
authRouter.post("/logout",logoutUser)

export default authRouter;