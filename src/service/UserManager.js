// Manager: Aplica reglas de negocio y decide qué hacer con los datos procesados por el Repository antes de enviarlos al controlador.

import UserRepository from "../repositories/UserRepository.js";

export default class UserManager {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(limit) {
        try {
            return await this.userRepository.getAllUsers(limit);
        } catch (error) {
            console.error("Error en UserManager mirar funcion getAllUsers:", error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await this.userRepository.getUserById(id);
        } catch (error) {
            console.error("Error en UserManager mirar funcion getUserById:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.userRepository.getUserByEmail(email);
        } catch (error) {
            console.error("Error en UserManager mirar funcion getUserByEmail:", error);
            throw error;
        }
    }

    async addUser(user) {
        try {
            return await this.userRepository.addUser(user);
        } catch (error) {
            console.error("Error en UserManager mirar funcion addUser:", error);
            throw error;
        }
    }

    async updateUser(id, updateFields) {
        try {
            return await this.userRepository.updateUser(id, updateFields);
        } catch (error) {
            console.error("Error en UserManager mirar funcion updateUser:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await this.userRepository.deleteUser(id);
        } catch (error) {
            console.error("Error en UserManager mirar funcion deleteUser:", error);
            throw error;
        }
    }
}