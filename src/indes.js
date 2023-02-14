const { Client } = require("pg");
const Redis = require("ioredis");

const postgresClient = new Client({
  host: 'localhost',
  port: 32768,
  database: 'dockerredis',
  user: 'postgres',
  password: 'postgrespw'
});

const redisClient = new Redis({
  host: "localhost",
  port: 6379
});

postgresClient.connect().then(() => {
  return postgresClient.query("SELECT * FROM users");
}).then((res) => {
  const data = res.rows;

  // Insere cada linha retornada da consulta SQL no Redis
  data.forEach((row) => {
    redisClient.set(row.id, JSON.stringify(row));
  });

  postgresClient.end();
  redisClient.quit();
}).catch((err) => {
  console.error(err);
});

