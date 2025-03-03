//middleware para verificar que el usuario esté logueado antes de acceder a ciertas rutas
export  function authMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Middleware para verificar que sea admin antes de acceder a la creación de artículos (que asume que el usuario ya está autenticado)
export function adminMiddleware(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    // Renderizamos la vista de acceso denegado con un mensaje.
    return res.status(403).render("accessDenied", { 
        style: "index.css", 
        message: "Solo los administradores tienen acceso." 
    });
}