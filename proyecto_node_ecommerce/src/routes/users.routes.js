import { json, Router } from "express";
import UserManager  from "../service/UserManager.js";

const router = Router();
const userManager = new UserManager();


//GET
router.get("/", async (req,res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit): undefined;
        let users = await userManager.getAllUser(limit)
        res.send({result: "succes", payload:users})
    } catch (error) {
        console.log("No se pudo obtener usuarios con mongoose(users.routes): ", error);
        res.status(500).send({ error: "No se pudo obtener usuarios con mongoose", message: error });
    }
})

//GET BY ID
router.get("/:uid", async (req,res) => {
    try {
        const userId = req.params.uid;
        const user = await userManager.getAllUserById(userId)
        if(user){
            res.send({result: "succes", payload:user})
        }else{
            res.status(404).json({error: "Usuario no encontrado"});
        }
    } catch (error) {
        console.log("No se pudo obtener usuarios por ID con mongoose(user.routes): ", error);
        res.status(500).send({ error: "No se pudo obtener usuarios por ID con mongoose", message: error });
    }
})

//POST
router.post("/", async (req,res)=>{
    try {
        const { first_name, last_name, email, password, age} = req.body;
        if (!first_name || !password) {
            return res.status(404).json({ error: "Los campos Nombre y Contraseña son obligatorios"});
        }
        const newUser = await userManager.addUser({ first_name, last_name, email, password, age })
        res.status(201).send({result: "succes", payload:newUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor (POST users.routes.js)" });
    }
});

//PUT by ID
router.put("/:uid", async (req,res)=>{
    try {
        const userId = req.params.uid;
        const updateFields = req.body;
        const updateUser = await userManager.updateUser(userId, updateFields)
        if(updateUser){
            res.status(201).send({result: "succes", payload: updateUser});
        }else{
            res.status(404).json({error: "Usuario no encontrado"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor (PUT users.routes.js)" });
    }
});


//DELETE by ID
router.delete("/:uid", async (req,res)=>{
    try {
        const userId = req.params.uid;
        const deleteUser = await userManager.deleteUser(userId)
        console.log(deleteUser);
        if (deleteUser) {
            res.status(201).send({result: "succes", payload: deleteUser});
        }else{
            res.status(404).json({error: "Usuario no encontrado"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor (DELETE products.routes.js)" });
    }
});



export default router;