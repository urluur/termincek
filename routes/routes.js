const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn');

router.post('/prijava', async (req, res, next) => {
  try {
    const { eposta, geslo } = req.body;
    if (eposta && geslo) {
      const queryResult = await DB.authStranka(eposta)
      if (queryResult.length > 0) {
        if (geslo === queryResult[0].stranka_geslo) {
          res.status(200).json({ stranka: queryResult[0], status: { success: true, msg: "Logged in" } })
        } else {
          res.status(200).json({ stranka: null, status: { success: false, msg: "email or password incorrect" } })
        }
      } else {
        res.status(200).send({ stranka: null, status: { success: false, msg: "email not registered" } })
      }
    } else {
      res.status(200).send({ stranka: null, status: { success: false, msg: "Input element missing" } })
    }
  } catch (err) {
    next(err)
  }
});

router.post('/registracija', async (req, res, next) => {
  try {
    const queryResult = await DB.registracijaStranka(
      req.body.ime,
      req.body.priimek,
      req.body.eposta,
      req.body.geslo,
      req.body.telefon
    )
    res.statusCode = 200;
    res.json({ stranka: queryResult, status: { success: true, msg: "User created" } })
    res.end();
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    next()
  }
});

router.get('/podjetja', async (req, res, next) => {
  try {
    const queryResult = await DB.vsaPodjetja()
    res.statusCode = 200;
    res.json(queryResult)
    res.end();
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    next()
  }
});

router.get('/podjetje/:podjetje_id', async (req, res, next) => {
  try {
    const queryResult = await DB.podjetje(req.params.podjetje_id)
    res.statusCode = 200;
    res.json(queryResult)
    res.end();
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
    next()
  }
});

router.get('/storitve/:podjetje_id', async (req, res, next) => {
  try {
    const queryResult = await DB.vseStoritve(req.params.podjetje_id)
    res.statusCode = 200;
    res.json(queryResult)
    res.end();
  } catch (err) {
    next(err)
  }
});

router.get('/delavci/:podjetje_id', async (req, res, next) => {
  try {
    const queryResult = await DB.vsiDelavci(req.params.podjetje_id)
    res.status(200).json(queryResult);
  } catch (err) {
    next(err)
  }
});

router.get('/narocila/:stranka_id', async (req, res, next) => {
  try {
    const queryResult = await DB.strankaNarocila(req.params.stranka_id)
    res.status(200).json(queryResult);
  } catch (err) {
    next(err)
  }
}
);

router.post('/narocilo/novo', async (req, res, next) => {
  try {
    const queryResult = await DB.ustvariNarocilo(
      req.body.narocilo_cas,
      req.body.narocilo_opombe,
      req.body.stranka_id,
      req.body.delavec_id,
      req.body.storitev_id
    )
    res.status(200).json(queryResult);
  } catch (err) {
    next(err)
  }
});

router.delete('/narocilo/preklici', async (req, res, next) => {
  try {
    const { narocilo_id } = req.body;
    const queryResult = await DB.prekliciNarocilo(narocilo_id)
    res.status(200).json(queryResult);
  } catch (err) {
    next(err)
  }
});

module.exports = router;