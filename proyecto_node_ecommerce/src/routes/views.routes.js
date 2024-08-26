import express from "express";
const router = express.Router()


let food = [
    { name: "Hamburguesa", price: "100" },
    { name: "Banana", price: "40" },
    { name: "Soda", price: "20" },
    { name: "Enzalada", price: "20" },
    { name: "Pizza", price: "20" }
];

router.get("/food", (req,res)=>{
    let userData = {
        name: "Axel",
        lastName: "Nuñez",
        role: "admin"
    }

    res.render("index",{
        user: userData,
        isAdmin: userData.role === "user",
        food: food,
        style: "index.css"
    })
})


export default router;
