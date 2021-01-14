require('dotenv').config()
var config = {
  debug: true,
  port: 3306,
  database: {
    host: 'localhost', // mobileapp.cluster-cn7bgoez6kwh.us-east-1.rds.amazonaws.com
    username: 'root',//process.env.DB_USER, //admin
    password: '',//process.env.DB_PASS, //eeCpIH4McdZUrmBslpPA
    database: 'your database',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  smtp_host:"your smpt host",
  smtp_port:"587",
  secret:"your secret",
  smtp_secure:false,
  smtp_user:"your username",
  smtp_pass:"your password",
  imageBaseUrl: "/public/profile_image/",

  page: 25
}
module.exports = config;
