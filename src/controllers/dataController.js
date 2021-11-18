const db = require('../models');


const makeAlert = async(values) => {
    const alert = await db.Alert.create(values);
}

const checkAlertPm2 = async (node, pm2, zone, register) => {
    var ica;
    var alert = "";

    if (pm2 >= 13 && pm2 < 37) {
        ica = ((100 - 51) / (37 - 13)) * (pm2 - 13) + 51;
        alert = "Aceptable";
    } else if (pm2 >= 38 && pm2 < 55) {
        ica = ((150 - 101) / (55 - 38)) * (pm2 - 38) + 101;
        alert = "Dañina para grupos sensibles";
    } else if (pm2 >= 56 && pm2 < 150) {
        ica = ((200 - 151) / (150 - 56)) * (pm2 - 56) + 151;
        alert = "Dañina a la salud";
    }

    values = {
        node: node,
        type: "pm2",
        ica: ica,
        description: alert,
        zone: zone,
        origin_fk: register
    }
    await makeAlert(values)
}

const checkAlertNo2 = async(node, no2, zone, register) => {
    var ica;
    var alert = "";

    if (no2 >= 0 && no2 < 100) {
        ica = ((50 - 0) / (100 - 0)) * (no2 - 0) + 0;
        alert = "Buena";
    } else if (no2 >= 101 && no2 < 189) {
        ica = ((100 - 51) / (189 - 101)) * (no2 - 101) + 51;
        alert = "Aceptable";
    }

    values = {
        node: node,
        type: "no2",
        ica: ica,
        description: alert,
        zone: zone,
        origin_fk: register,
    }
    await makeAlert(values) 
}

const checkAlertCo = async(node, co, zone, register) => {
    var ica;
    var alert = "";

    if (co >= 0 && co <= 4) {
        ica = ((50 - 0) / (4 - 0)) * (co - 0) + 0;
        alert = "Buena";
    } else if (co >= 5 && co <= 9) {
        ica = ((100 - 51) / (9 - 5)) * (co - 5) + 51;
        alert = "Aceptable";
    } else if (co >= 10 && co <= 12) {
        ica = ((150 - 101) / (12 - 10)) * (co - 10) + 101;
        alert = "Dañina para grupos sensibles";
    } else if (co >= 13 && co <= 15) {
        ica = ((200 - 151) / (15 - 13)) * (co - 13) + 151;
        alert = "Dañina para la salud";
    } else if (co >= 16 && co <= 30) {
        ica = ((300 - 201) / (30 - 16)) * (co - 16) + 201;
        alert = "Muy dañina para la salud";
    } else if (co >= 31 && co <= 40) {
        ica = ((400 - 301) / (40 - 31)) * (co - 31) + 301;
        alert = "Peligrosa";
    } else if (co >= 41 && co <= 50) {
        ica = ((500 - 401) / (50 - 41)) * (co - 41) + 401;
        alert = "Muy peligrosa";
    }

    values = {
        node: node,
        type: "co",
        ica: ica,
        description: alert,
        zone: zone,
        origin_fk: register,
    }
    await makeAlert(values);
}

//exports.save = async (req, res, next)
exports.save = async (values) => {
    try {
        const { node, pm2, co, no2, latitud, longitud } = values;

        var location = ""
        if (latitud >= 3.28 && latitud < 3.39 && longitud <= -76.52 && longitud >= -76.58){
            location = "NOR"
        }
        else if(latitud >= 3.28 && latitud < 3.39 && longitud <= -76.46 && longitud > -76.52 ){
            location = "NOC"
        }
        else if(latitud >= 3.39 && latitud <= 3.5 && longitud <= -76.52 && longitud >= -76.58){
            location = "SOR"
        }
        else if(latitud >= 3.39 && latitud <= 3.5 && longitud <= -76.46 && longitud > -76.52){
            location = "SOC"
        }

        const data = await db.Data.create({
            node: node,
            pm2: pm2,
            co: co,
            no2: no2,
            latitude: latitud,
            length: longitud,
            zone: location
        });

        /* Alert pm */
        var alertpm2 = await checkAlertPm2(node, pm2, location, data.id);
        /* Alert No2 */
        var alertno2 = await checkAlertNo2(node, no2, location, data.id);
        /*Alert CO */
        var alertco = await checkAlertCo(node, co,location, data.id);
       
        console.log('Registro almacenado correctamente.');

    } catch (error) {
        console.log("Error al guardar la información")
        console.log(error)
    }
};

exports.info = async (req, res, next) => {
    const { node_id } = req.query;
    
    try {
        const info = await db.Data.findAndCountAll({
            where: { node: node_id },
            order: [['createdAt', 'DESC']],
        });
        if (info.count != 0) {
            res.status(200).json(info);
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

exports.data = async (req,res, next) => {
    const { node_id } = req.query;
    try {
        params = {}
        if (node_id){
            params = {node: node_id}
        }
        const info = await db.Data.findAndCountAll({
            where: params,
            order: [['createdAt', 'DESC']],
        });
        if (info.count != 0) {
            res.status(200).json(info);
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