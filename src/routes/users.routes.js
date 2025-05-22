import { json, Router } from "express";
import UserManager  from "../service/UserManager.js";
import passport from "../config/passport.config.js";
import CartManager from "../service/CartManager.js";
import bcrypt from "bcrypt";

const router = Router();
const userManager = new UserManager();
const cartManager = new CartManager();

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


// POST para iniciar sesión
// El endpoint debería ser llamado desde el frontend cuando el usuario quiera iniciar sesión
router.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(401).json({ success: false, message: err.message });
      }

      req.session.user = user;
      console.log("Sesión iniciada:", req.session.user);

      return res.json({ success: true, message: "Inicio de sesión exitoso" });
    });
  })(req, res, next);
});

// POST para registrar un nuevo usuario
// El endpoint debería ser llamado desde el frontend cuando el usuario quiera registrarse
router.post("/register", async (req, res, next) => {
    passport.authenticate("register", async (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ success: false, message: info.message });
        }

        try {
            const newCart = await cartManager.addCart(user._id); // usa el userId del usuario recién creado
            user.cartId = newCart._id;
            await user.save();

            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ success: true, message: "Usuario registrado y carrito creado exitosamente" });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al crear el carrito para el usuario", error: error.message });
        }
    })(req, res, next);
});


// POST para cambiar la contraseña
// El endpoint debería ser llamado desde el frontend cuando el usuario quiera cambiar su contraseña
router.post("/changepassword", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await userManager.getUserByEmail(email);

    if (user) {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

      await userManager.updateUser(user._id, { password: hashedPassword });

      res.json({ success: true, message: "Contraseña actualizada correctamente" });
    } else {
      res.status(401).json({ success: false, message: "Email no encontrado" });
    }
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ success: false, message: "Error al cambiar la contraseña" });
  }
});


export default router;