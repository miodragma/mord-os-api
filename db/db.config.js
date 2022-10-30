module.exports = {
  HOST: "localhost",
  USER: "mordos",
  PASSWORD: "mordos",
  DB: "mordos",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
