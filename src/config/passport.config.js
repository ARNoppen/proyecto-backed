import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { userModel } from "../dao/models/user.model.js";


// estrategia de registro
passport.use("register", new LocalStrategy(
    { usernameField: "email", passwordField: "password", passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: "Email ya registrado" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                email,
                password: hashedPassword,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                age: req.body.age,
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }
));

// estrategia de login
passport.use("login", new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: "Contraseña incorrecta" });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// serializar y deserializar usuario
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;