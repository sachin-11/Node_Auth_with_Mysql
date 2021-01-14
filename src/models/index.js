const dbConfig = require("../../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database.database, dbConfig.database.username, dbConfig.database.password, {
    host: dbConfig.database.host,
    dialect: dbConfig.database.dialect,
    operatorsAliases: 0,
    pool: {
        max: dbConfig.database.pool.max,
        min: dbConfig.database.pool.min,
        acquire: dbConfig.database.pool.acquire,
        idle: dbConfig.database.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users")(sequelize, Sequelize);
db.user_verification = require("./user_verification")(sequelize, Sequelize);


module.exports = db;
