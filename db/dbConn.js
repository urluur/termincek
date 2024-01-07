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

  ustvariNarocilo(narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) {
    return this.query(
      `INSERT INTO Narocilo (narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) VALUES (?,?,?,?,?)`,
      [narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id]
    );
  }

  prekliciNarocilo(narocilo_id) {
    return this.query(`DELETE FROM Narocilo WHERE narocilo_id = ?`, narocilo_id);
  }

  authStranka(stranka_eposta) {
    return this.query('SELECT * FROM stranka WHERE stranka_eposta = ?', stranka_eposta);
  }

  authDelavec(delavec_eposta) {
    return this.query('SELECT * FROM delavec WHERE delavec_eposta = ?', delavec_eposta);
  }

  registracijaStranka(ime, priimek, eposta, geslo, telefon) {
    return this.query(`INSERT INTO Stranka (stranka_ime,stranka_priimek,stranka_eposta,stranka_geslo,stranka_telefon) VALUES (?,?,?,?,?)`,
      [ime, priimek, eposta, geslo, telefon]);
  }

  vsaPodjetja() {
    return this.query(`SELECT * FROM Podjetje`);
  }

  podjetje(id) {
    return this.query(`SELECT * FROM Podjetje WHERE podjetje_id = ?`, id);
  }

  vseStoritve(podjetje_id) {
    return this.query(`SELECT * FROM Storitev WHERE podjetje_id = ?`, podjetje_id);
  }

  vsiDelavci(podjetje_id) {
    return this.query(`SELECT * FROM Delavec WHERE podjetje_id = ?`, podjetje_id);
  }

  strankaNarocila(stranka_id) {
    return this.query(`
    SELECT n.*, s.*, d.delavec_ime, d.delavec_priimek, p.podjetje_naziv, p.podjetje_naslov
    FROM Narocilo n 
    JOIN Storitev s ON n.storitev_id = s.storitev_id 
    JOIN Delavec d ON n.delavec_id = d.delavec_id 
    JOIN Podjetje p ON s.podjetje_id = p.podjetje_id
    WHERE n.stranka_id = ? 
    ORDER BY n.narocilo_id DESC
    `, stranka_id);
  }
}

const db = new Database();
db.connect();

module.exports = db;