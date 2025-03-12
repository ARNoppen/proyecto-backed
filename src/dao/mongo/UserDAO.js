import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

export default class UserDAO {
    async getAllUsers(limit) {
        try {
            const options = limit ? { limit: parseInt(limit) } : {};
            return await userModel.find({}, null, options).exec();
        } catch (error) {
            console.error("Error en UserDAO mirar funcion getAllUsers:", error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await userModel.findById(id).exec();
        } catch (error) {
            console.error("Error en UserDAO mirar funcion getUserById:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModel.findOne({ email }).exec();
        } catch (error) {
            console.error("Error en UserDAO mirar funcion getUserByEmail:", error);
            throw error;
        }
    }

    async addUser(user) {
        try {
            const saltRounds = 10;
            if (!user.password) throw new Error("La contraseña es requerida.");
            user.password = bcrypt.hashSync(user.password, saltRounds);

            const newUser = new userModel(user);
            return await newUser.save();
        } catch (error) {
            console.error("Error en UserDAO mirar funcion addUser:", error);
            throw error;
        }
    }

    async updateUser(id, updateFields) {
        try {
            return await userModel.findByIdAndUpdate(id, updateFields, { new: true }).exec();
        } catch (error) {
            console.error("Error en UserDAO mirar funcion updateUser:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await userModel.findByIdAndDelete(id).exec();
        } catch (error) {
            console.error("Error en UserDAO mirar funcion deleteUser:", error);
            throw error;
        }
    }
}