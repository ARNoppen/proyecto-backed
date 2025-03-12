import UserDAO from "../dao/mongo/UserDAO.js";

export default class UserManager {
    constructor() {
        this.userDAO = new UserDAO();
    }

    async getAllUsers(limit) {
        try {
            return await this.userDAO.getAllUsers(limit);
        } catch (error) {
            console.error("Error en UserManager mirar funcion getAllUsers:", error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await this.userDAO.getUserById(id);
        } catch (error) {
            console.error("Error en UserManager mirar funcion getUserById:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.userDAO.getUserByEmail(email);
        } catch (error) {
            console.error("Error en UserManager mirar funcion getUserByEmail:", error);
            throw error;
        }
    }

    async addUser(user) {
        try {
            return await this.userDAO.addUser(user);
        } catch (error) {
            console.error("Error en UserManager mirar funcion addUser:", error);
            throw error;
        }
    }

    async updateUser(id, updateFields) {
        try {
            return await this.userDAO.updateUser(id, updateFields);
        } catch (error) {
            console.error("Error en UserManager mirar funcion updateUser:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await this.userDAO.deleteUser(id);
        } catch (error) {
            console.error("Error en UserManager mirar funcion deleteUser:", error);
            throw error;
        }
    }
}