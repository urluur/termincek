const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn');

router.get('/api', (req, res) => {
  res.send('Termincek backend Home!');
})

router.post('/prijava', async (req, res, next) => {
  try {
    console.log(req.body);
    const eposta = req.body.eposta;
    const geslo = req.body.geslo;
    if (eposta && geslo) {
      const queryResult = await DB.AuthStranka(eposta)
      if (queryResult.length > 0) {
        if (geslo === queryResult[0].stranka_geslo) {
          //req.session.user = queryResult
          //req.session.logged_in = true
          res.statusCode = 200;
          res.json({ user: queryResult[0], status: { success: true, msg: "Logged in" } })
        } else {
          // Če je geslo napačno
          res.statusCode = 200;
          res.json({ user: null, status: { success: false, msg: "email or password incorrect" } })
          console.log("INCORRECT PASSWORD")
        }
      } else {
        // Če ne najde useja v bazi
        res.statusCode = 200;
        res.send({ user: null, status: { success: false, msg: "email not registsred" } })
      }
    }
    else {
      // če nisi nič napisal
      res.statusCode = 200;
      res.send({ logged: false, user: null, status: { success: false, msg: "Input element missing" } })
      console.log("Please enter email and Password!")
    }
    res.end();
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    next()
  }
});

router.post('/registracija', async (req, res, next) => {
  try {
    console.log("Body: ", req.body);
    const queryResult = await DB.RegistracijaStranka(
      req.body.ime,
      req.body.priimek,
      req.body.eposta,
      req.body.geslo,
      req.body.tel
    )
    res.statusCode = 200;
    res.json({ user: queryResult, status: { success: true, msg: "User created" } })
    res.end();
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    next()
  }
}
);

module.exports = router;