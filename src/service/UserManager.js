import { userModel } from "./models/user.model.js";
import bcrypt from "bcrypt";

export default class UserManager { 
    constructor(){
    }
    //metodos
    async getAllUser(limit){
        try {
            const query = {};
            const options = limit ? { limit: parseInt(limit) } : {};
            return await userModel.find(query, null, options).exec();
        } catch (error) {
            console.error("Error al obtener usuarios: ", error);
            throw error;
        }
    }

    async getAllUserById(id){
        try {
            return await userModel.findById(id).exec()
        } catch (error) {
            console.error("Error al obtener usuarios: ",error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModel.findOne({ email }).exec();
        } catch (error) {
            console.error("Error al obtener usuario por email:", error);
            throw error;
        }
    }

    async addUser(user){
        try {
            const saltRounds = 10;
            console.log("Contraseña recibida para hashear:", user.password);
            if (!user.password) {
                throw new Error("La contraseña es requerida para crear el usuario.");
            }
            user.password = bcrypt.hashSync(user.password, saltRounds);
            const newUser = new userModel(user)
            return await newUser.save()
        } catch (error) {
            console.error("Error al agregar usuarios: ",error);
            throw error;
        }
    }

    async updateUser(id, updateFields){
        try {
            return await userModel.findByIdAndUpdate(id, updateFields, {new: true}).exec();
        } catch (error) {
            console.error("Error al actualizar usuarios: ",error);
            throw error;
        }
    }

    async deleteUser(id){
        try {
            return await userModel.findByIdAndDelete(id).exec();
        } catch (error) {
            console.error("Error al eliminar usuarios: ",error);
            throw error;
        }
    }
};