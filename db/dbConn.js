const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

  async vseStoritve() {
    return this.query(`SELECT * FROM Storitve`);
  }

  async podjetjeStoritve(podjetje_id) {
    return this.query(`SELECT * FROM Storitve WHERE podjetje_id = ?`, podjetje_id);
  }

  async ustvariNarocilo(narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) {
    return this.query(
      `INSERT INTO Narocilo (narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id) VALUES (?,?,?,?,?)`,
      [narocilo_cas, narocilo_opombe, stranka_id, delavec_id, storitev_id]
    );
  }

  async prekliciNarocilo(narocilo_id) {
    return this.query(`DELETE FROM Narocilo WHERE narocilo_id = ?`, narocilo_id);
  }

  async authStranka(stranka_eposta) {
    return this.query('SELECT * FROM stranka WHERE stranka_eposta = ?', [stranka_eposta]);
  }

  async registracijaStranka(ime, priimek, eposta, geslo, telefon) {
    const hashedPassword = await bcrypt.hash(geslo, saltRounds);
    return this.query(
      `INSERT INTO Stranka (stranka_ime, stranka_priimek, stranka_eposta, stranka_geslo, stranka_telefon) VALUES (?,?,?,?,?)`,
      [ime, priimek, eposta, hashedPassword, telefon]
    );
  }

  async authDelavec(delavec_eposta) {
    return this.query('SELECT * FROM delavec WHERE delavec_eposta = ?', delavec_eposta);
  }

  async registracijaDelavec(delavec_ime, delavec_priimek, delavec_slika, delavec_eposta, delavec_geslo, delavec_telefon, podjetje_id) {
    const hashedPassword = await bcrypt.hash(delavec_geslo, saltRounds);
    return this.query(
      `INSERT INTO Delavec (delavec_ime, delavec_priimek, delavec_slika, delavec_eposta, delavec_geslo, delavec_telefon, podjetje_id) VALUES (?,?,?,?,?,?,?)`,
      [delavec_ime, delavec_priimek, delavec_slika, delavec_eposta, hashedPassword, delavec_telefon, podjetje_id]
    );
  }

  async registracijaPodjetje(naziv, admin, geslo, naslov, slika) {
    const hashedPassword = await bcrypt.hash(geslo, saltRounds);
    return this.query(
      `INSERT INTO Podjetje (podjetje_naziv, podjetje_admin, podjetje_geslo, podjetje_naslov, podjetje_slika) VALUES (?,?,?,?,?)`,
      [naziv, admin, hashedPassword, naslov, slika]
    );
  }

  async authPodjetje(podjetje_admin) {
    return this.query('SELECT * FROM podjetje WHERE podjetje_admin = ?', podjetje_admin);
  }

  async vsaPodjetja() {
    return this.query(`SELECT * FROM Podjetje WHERE podjetje_id != 0`);
  }

  async podjetje(id) {
    return this.query(`SELECT * FROM Podjetje WHERE podjetje_id = ?`, id);
  }

  async vseStoritve(podjetje_id) {
    return this.query(`SELECT * FROM Storitev WHERE podjetje_id = ?`, podjetje_id);
  }

  async vsiDelavci(podjetje_id) {
    return this.query(`SELECT * FROM Delavec WHERE podjetje_id = ?`, podjetje_id);
  }

  async strankaNarocila(stranka_id) {
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
  async delavciNarocila(delavec_id) {
    return this.query(`
    SELECT Narocilo.*, Storitev.*, Stranka.stranka_ime, Stranka.stranka_priimek, Stranka.stranka_telefon, Stranka.stranka_eposta
    FROM Narocilo
    JOIN Storitev ON Narocilo.storitev_id = Storitev.storitev_id
    JOIN Stranka ON Narocilo.stranka_id = Stranka.stranka_id
    JOIN Podjetje ON Storitev.podjetje_id = Podjetje.podjetje_id
    WHERE Narocilo.delavec_id = ?
    AND Narocilo.stranka_id NOT BETWEEN 0 AND 6
    ORDER BY Narocilo.narocilo_id DESC
    `, delavec_id);
  }

  async izbrisiStranko(stranka_id) {
    return this.query(`DELETE FROM Stranka WHERE stranka_id = ?`, stranka_id);
  }

  async izbrisiDelavca(delavec_id) {
    return this.query(`DELETE FROM Delavec WHERE delavec_id = ?`, delavec_id);
  }

  async izbrisiPodjetje(podjetje_id) {
    return this.query(`DELETE FROM Podjetje WHERE podjetje_id = ?`, podjetje_id);
  }

  async izbrisiStoritev(storitev_id) {
    return this.query(`DELETE FROM Storitev WHERE storitev_id = ?`, storitev_id);
  }

  async ustvariStoritev(ime, opis, slika, cena, trajanje, podjetje_id) {
    return this.query(
      `INSERT INTO Storitev (storitev_ime, storitev_opis, storitev_slika, storitev_cena, storitev_trajanje, podjetje_id) VALUES (?,?,?,?,?,?)`,
      [ime, opis, slika, cena, trajanje, podjetje_id]
    );
  }

  async urediStoritev(id, ime, opis, slika, cena, trajanje) {
    return this.query(
      `UPDATE Storitev SET storitev_ime = ?, storitev_opis = ?, storitev_slika = ?, storitev_cena = ?, storitev_trajanje = ? WHERE storitev_id = ?`,
      [ime, opis, slika, cena, trajanje, id]
    );
  }

  async urnikNarocilo(narocilo) {
    return this.query(
      `INSERT INTO Narocilo (narocilo_cas, stranka_id, delavec_id, storitev_id) VALUES (?,?,?,?)`,
      [narocilo.narocilo_cas, narocilo.stranka_id, narocilo.delavec_id, narocilo.storitev_id]
    );
  }

  async izbrisiUrnik(delavec_id) {
    return this.query(`DELETE FROM Narocilo WHERE delavec_id = ? AND stranka_id BETWEEN 0 AND 6`, delavec_id);
  }

  async ustvariPremor(cas, delavec_id, storitev_id) {
    return this.query(
      `INSERT INTO Narocilo (narocilo_cas, delavec_id, storitev_id) VALUES (?,?,?)`,
      [cas, delavec_id, storitev_id]
    );
  }

  async izbrisiPremor(narocilo_id) {
    return this.query(`DELETE FROM Narocilo WHERE narocilo_id = ?`, narocilo_id);
  }

  async vsiPremori(delavec_id) {
    return this.query(`
    SELECT Narocilo.*, Storitev.*
    FROM Narocilo
    JOIN Storitev ON Narocilo.storitev_id = Storitev.storitev_id
    WHERE delavec_id = ? AND stranka_id IS NULL
    `, delavec_id);
  }

}

const db = new Database();
db.connect();

module.exports = db;