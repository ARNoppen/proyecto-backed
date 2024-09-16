import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router();


//GET
router.get("/", async(req,res) => {
    try {
        let users = await userModel.find()
        res.send({result: "succes", payload:users})
    } catch (error) {
        console.log("No se pudo obtener usuarios con mongoose(user.routes): ", error);
        res.status(500).send({ error: "No se pudo obtener usuarios con mongoose", message: error });
    }
})


//POST



//PUT



//DELETE




export default router;