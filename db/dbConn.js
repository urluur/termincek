const mysql = require('mysql2');

class Database {
  constructor() {
    this.conn = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE
    });
  }

  connect() {
    this.conn.connect((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Database connection established!');
      }
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.conn.query(sql, params, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  vseStoritve() {
    return this.query(`SELECT * FROM Storitve`);
  }

  podjetjeStoritve(podjetje_id) {
    return this.query(`SELECT * FROM Storitve WHERE podjetje_id = ?`, podjetje_id);
  }

  ustvariNarocilo(narocilo_id, narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) {
    return this.query(
      `INSERT INTO Narocilo (narocilo_id, narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) VALUES (?,?,?,?,?,?)`,
      [narocilo_id, narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id]
    );
  }

  brisiNarocilo(narocilo_id) {
    return this.query(`DELETE FROM Narocilo WHERE narocilo_id = ?`, narocilo_id);
  }

  AuthStranka(stranka_eposta) {
    return this.query('SELECT * FROM stranka WHERE stranka_eposta = ?', stranka_eposta);
  }

  AuthDelavec(delavec_eposta) {
    return this.query('SELECT * FROM delavec WHERE delavec_eposta = ?', delavec_eposta);
  }

  RegistracijaStranka(ime, priimek, eposta, geslo, telefon) {
    return this.query(`INSERT INTO Stranka (stranka_ime,stranka_priimek,stranka_eposta,stranka_geslo,stranka_telefon) VALUES (?,?,?,?,?)`,
      [ime, priimek, eposta, geslo, telefon]);
  }

  VsaPodjetja() {
    return this.query(`SELECT * FROM Podjetje`);
  }

  Podjetje(id) {
    return this.query(`SELECT * FROM Podjetje WHERE podjetje_id = ?`, id);
  }

  VseStoritve(podjetje_id) {
    return this.query(`SELECT * FROM Storitve WHERE podjetje_id = ?`, podjetje_id);
  }
}

const db = new Database();
db.connect();

module.exports = db;