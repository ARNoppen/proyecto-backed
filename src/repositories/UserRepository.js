// Repository: es una capa intermedia que convierte los datos en objetos más útiles para la aplicación. También puede implementar caché, 
// optimización de consultas, etc.import UserDAO from "../dao/mongo/UserDAO.js";

import UserDAO from "../dao/mongo/UserDAO.js";

export default class UserRepository {
    constructor() {
        this.userDAO = new UserDAO();
    }

    async getAllUsers(limit) {
        return await this.userDAO.getAllUsers(limit);
    }

    async getUserById(id) {
        return await this.userDAO.getUserById(id);
    }

    async getUserByEmail(email) {
        return await this.userDAO.getUserByEmail(email);
    }

    async addUser(user) {
        return await this.userDAO.addUser(user);
    }

    async updateUser(id, updateFields) {
        return await this.userDAO.updateUser(id, updateFields);
    }

    async deleteUser(id) {
        return await this.userDAO.deleteUser(id);
    }
}