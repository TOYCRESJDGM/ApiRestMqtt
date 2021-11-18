const bcrypt = require('bcryptjs');
const db = require('../models');
const tokenServices = require('../services/token');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const Usuario = await db.User.findOne({ where: { email: req.body.email } });
        if (Usuario) {
            res.status(409).send({
                error: 'El correo electrónico ya se encuentra en uso.'
            })
        }
        else {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            if (req.body.rol == "usuario"){
                values = {
                    email: req.body.email,
                    name: req.body.name,
                    node: req.body.node,
                    phone: req.body.phone,
                    password: req.body.password,
                    rol: req.body.rol,
                }
                const Usuario = await db.User.create(values);
                res.status(200).send({
                    message: 'Usuario creado con éxito.'
                });
            }
            else {
                res.status(409).send({
                    error: 'Usuario no autorizado.'
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const Usuario = await db.User.findOne({ where: { email: req.body.email } });
        if (Usuario) {
            res.status(409).send({
                error: 'El correo electrónico ya se encuentra en uso.'
            })
        }
        else {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            if (req.body.rol == "administrador" || req.body.rol == "ente gubernamental"){
                values = {
                    email: req.body.email,
                    user_name: req.body.user_name,
                    node: null,
                    phone: req.body.phone,
                    password: req.body.password,
                    rol: req.body.rol,
                }
                const Usuario = await db.User.create(values);
                res.status(200).send({
                    message: 'Usuario creado con éxito.'
                });
            }
            else {
                res.status(409).send({
                    error: 'Usuario no autorizado.'
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
};

exports.update = async (req,res,next) =>{
    try {
        const registro = await db.User.update({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            node: req.body.node,
            rol: req.body.rol,
        },
            {
                where: {
                    id: req.body.id
                },
            });       
        res.status(200).send({
            message: 'Usuario modificado con éxito.'
        });
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const Usuario = await db.User.findOne({ where: { email: req.body.email } });
        if (Usuario){
            const passwordIsValid = bcrypt.compareSync(req.body.password, Usuario.password);
            if (passwordIsValid) {
                const token = await tokenServices.encode(Usuario);
                res.status(200).send({
                    message: 'Bienvenido',
                    token: token,
                    user:
                    {
                        id: Usuario.id,
                        name: Usuario.name,
                        email: Usuario.email,
                        rol: Usuario.rol,
                        node: Usuario.node
                    }
                })
            } else {
                //error en la autenticación
                res.status(401).json({
                    error: 'Error en el usuario o contraseña.'
                })
            }
        } else {
            //error en la autenticación
            res.status(404).json({
                error: 'Usuario no encontrado.'
            })
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        })
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const users = await db.User.findAndCountAll()
        if (users.count != 0) {
            res.status(200).json(users);
        } else {
            res.status(404).send({
                error: 'No hay registros en el sistema.'
            });
        }
    } catch (err) {
        return res.status(500).json({ error: '¡Error en el servidor!' });

    }
};

exports.detail = async (req, res, next) => {
    const { user_id } = req.query;
    try {
        const oneuser = await db.User.findAndCountAll({
            where: { id: user_id },
        });
        if (oneuser.count != 0) {
            res.status(200).json(oneuser);
        } else {
            res.status(404).send({
                error: 'No hay registros en el sistema.'
            });
        }
    } catch (error) {
        res.status(500).send({
            error: '¡Error en el servidor!'
        });
        next(error);
    }
}



