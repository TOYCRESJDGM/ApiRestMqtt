const db = require("../models");
const { Op } = require('sequelize');

exports.info = async (req, res, next) => {
  const { node_id } = req.query;
  const { type, last, zone } = req.query;

  var params = {};
  var last_node = {};
  if (type) {
    switch (type) {
      case "co":
        params["type"] = "co";
        break;
      case "pm2":
        params["type"] = "pm2";
        break;
      case "no2":
        params["type"] = "no2";
        break;
      default:
        None;
    }
  }
  if (last) {
    last_node = { limit: 1 };
  }
  if (zone) {
    switch (zone) {
      case "NOR":
        params["zone"] = "NOR";
        break;
      case "NOC":
        params["zone"] = "NOC";
        break;
      case "SOR":
        params["zone"] = "SOR";
        break;
      case "SOC":
        params["zone"] = "SOC";
        break;
      default:
        None;
    }
  }

  try {
    const info = await db.Alert.findAndCountAll({
      where: { node: node_id, ...params },
      order: [["createdAt", "DESC"]],
      ...last_node,
    });
    if (info.count != 0) {
      res.status(200).json(info);
    } else {
      res.status(404).send({
        error: "No hay registros en el sistema.",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: "¡Error en el servidor!",
    });
    next(error);
  }
};

const checkoption = async (value) => {
    var description = ""
    if(value > 0 && value <=54){
        description = "Buena"
    }
    else if( value > 54 && value<=154){
        description = "Aceptable"
    }
    else if(value >154 && value<=254){
        description = "Dañina a la salud"
    }
    else if(value>254 && value<=354){
        description = "Dañina a la salud"
    }

    return description

}


const getByZone = async (location, option) => {
    var startedDate = new Date()
    var endDate = new Date(startedDate.getTime() - (200*60000)); //200*600
    const info = await db.Alert.findAndCountAll({
        where: { zone: location, type: option, createdAt: { [Op.between]: [endDate.toISOString(),startedDate.toISOString()]}}
    });

    var ica_value = 0.0;
    var total_ica = 0.0;
    for(var i=0; i<info.rows.length; i++){
        ica_value += info.rows[i].ica
    }

    total_ica = ica_value/info.count
    var alert = await checkoption(total_ica);

    let date = ("0" + startedDate.getDate()).slice(-2);
    // current month
    let month = ("0" + (startedDate.getMonth() + 1)).slice(-2);
    // current year
    let year = startedDate.getFullYear();
    // current hours
    let hours = startedDate.getHours();
    // current minutes
    let minutes = startedDate.getMinutes();
    // current seconds
    let seconds = startedDate.getSeconds();

    return {
        type: option,
        ica: Math.round(total_ica),
        description: alert,
        date: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
        zone: location
    };
}

const mapinfo = async(zone) =>{
    var data = [];
    byco = await getByZone(zone, "co");
    bypm2 = await getByZone(zone, "pm2");
    byno2 = await getByZone(zone, "no2");
    data = [byco, bypm2, byno2];
    return data
}

exports.public = async (req, res, next) => {
    const { zone } = req.query;
    var info = [];
    if(zone){
       info.push(await mapinfo(zone))
    }
    else {
        var zones = ["NOR", "NOC", "SOR", "SOC"]
        for(var i=0; i<zones.length; i++){
            info.push(await mapinfo(zones[i]))
        }
    }
    res.status(200).json(info);
}