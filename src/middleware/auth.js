const tokenServices = require('../services/token');

module.exports = {
    verifyAdmin: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                error: 'Token no encontrado.'
            });
        }
        else {
            const validateResponse = await tokenServices.decode(req.headers.token);
            if (validateResponse.rol === 'administrador') {
                next();
            } else {
                return res.status(403).send({
                    error: 'Usuario no autorizado.'
                });
            }
        }
    },
    verifyGovernmentEntity : async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                error: 'Token no encontrado.'
            });
        }
        else {
            const validateResponse = await tokenServices.decode(req.headers.token);
            if (validateResponse.rol === 'ente gubernamental' || validateResponse.rol === 'administrador') {
                next();
            } else {
                return res.status(403).send({
                    error: 'Usuario no autorizado.'
                });
            }
        }

    },
    verifyUser: async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                error: 'Token no encontrado.'
            });
        }
        else {
            const validateResponse = await tokenServices.decode(req.headers.token);
            if (validateResponse.rol === 'administrador' ||
                validateResponse.rol === 'ente gubernamental' ||
                validateResponse.rol === 'usuario') {
                next();
            } else {
                return res.status(403).send({
                    error: 'Usuario no autorizado.'
                });
            }
        }

    },
}