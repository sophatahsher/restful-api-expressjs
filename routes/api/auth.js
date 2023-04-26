import express from "express";
import {authRoutes} from "../../src/controllers/auth/AuthRoutes";

const apiRoutes = express.Router();

apiRoutes.get("/", (req, res, next)=>{
    res.json({ message: "from index api" });
});

apiRoutes.use("/auth", authRoutes);

export default apiRoutes;