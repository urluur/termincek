const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
})

conn.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Database connection established!');
  }
})

let datapool = {};

// na ne bo useful
datapool.vseStoritve = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Storitve`, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

datapool.podjetjeStoritve = (podjetje_id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Storitve WHERE podjetje_id = ?`, podjetje_id, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

datapool.ustvariNarocilo = (narocilo_id, narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO Narocilo (narocilo_id, narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) VALUES (?,?,?,?,?,?)`,
      [narocilo_id, narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id],
      (err, res) => {
        if (err) { return reject(err) }
        return resolve(res)
      }
    )
  })
}
// TODO: Brisi narocilo

datapool.AuthStranka = (stranka_eposta) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM stranka WHERE stranka_eposta = ?', stranka_eposta, (err, res, fields) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

datapool.AuthDelavec = (delavec_eposta) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM delavec WHERE delavec_eposta = ?', delavec_eposta, (err, res, fields) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

datapool.AddStranka = (ime, priimek, eposta, geslo, telefon) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO Stranka (stranka_ime,stranka_priimek,stranka_eposta,stranka_geslo,stranka_telefon) VALUES (?,?,?,?,?,?)`,
      [ime, priimek, eposta, geslo, telefon],
      (err, res) => {
        if (err) { return reject(err) }
        return resolve(res)
      }
    )
  })
}


module.exports = datapool;