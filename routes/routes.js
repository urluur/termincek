const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn');
const bcrypt = require('bcrypt');
const { body, validationResult, param } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


router.post('/prijava',
  body('eposta').isEmail(),
  body('geslo').isString(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { eposta, geslo } = req.body;
      if (eposta && geslo) {
        const queryResult = await DB.authStranka(eposta)
        if (queryResult.length > 0 && queryResult[0].stranka_geslo) {
          const match = await bcrypt.compare(geslo, queryResult[0].stranka_geslo);
          if (match) {
            req.session.user = queryResult[0];
            req.session.logged_in = true;

            req.session.save((err) => {
              if (err) {
                console.log("SEJE NE SHRANI: " + err)
              }
              return res.status(200).json({ stranka: queryResult[0], status: { success: true, msg: "Prijava uspešna" } })
            })

          } else {
            res.status(200).json({ stranka: null, status: { success: false, msg: "Napačni podatki" } }) // geslo ali uporabniško ime napačno
          }
        } else {
          res.status(200).send({ stranka: null, status: { success: false, msg: "Napačni podatki" } }) // uporabnik ni registriran
        }
      } else {
        res.status(200).send({ stranka: null, status: { success: false, msg: "Vnesite vse podatke" } })
      }
    } catch (error) {
      next(error);
    }
  });

router.get('/session', (req, res, next) => {
  try {
    if (req.session.logged_in) {
      res.status(200).json(req.session.user)
    } else {
      res.status(401).json({ stranka: null, status: { success: false, msg: "Uporabnik ni prijavljen" } })
    }
  } catch (error) {
    res.status(500).json({ status: { success: false, msg: "Napaka pri pridobivanju seje" } })
    next(error);
  }
});

router.get('/odjava', (req, res, next) => {
  try {
    req.session.destroy();
    res.status(200).json({ status: { success: true, msg: "Uspešna odjava" } })
  } catch (error) {
    res.status(500).json({ status: { success: false, msg: "Napaka pri odjavi" } })
    next(error);
  }
});

router.post('/registracija',
  body('ime').notEmpty(),
  body('priimek').notEmpty(),
  body('eposta').isEmail(),
  body('geslo').isLength({ min: 8 }),
  body('telefon').isMobilePhone(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.registracijaStranka(
        req.body.ime,
        req.body.priimek,
        req.body.eposta,
        req.body.geslo,
        req.body.telefon
      )
      res.statusCode = 200;
      res.json({ stranka: queryResult, status: { success: true, msg: "Uporabnik ustvarjen" } })
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

router.get('/podjetje/:podjetje_id',
  param('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
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

router.get('/storitve/:podjetje_id',
  param('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.vseStoritve(req.params.podjetje_id)
      res.statusCode = 200;
      res.json(queryResult)
      res.end();
    } catch (err) {
      next(err)
    }
  });

router.get('/delavci/:podjetje_id',
  param('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const queryResult = await DB.vsiDelavci(req.params.podjetje_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

router.get('/narocila/',
  async (req, res, next) => {
    try {
      if (req.session.logged_in) {
        const queryResult = await DB.strankaNarocila(req.session.user.stranka_id)
        res.status(200).json(queryResult);
      }
      else {
        res.status(500).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
      }
    } catch (err) {
      next(err)
    }
  }
);

router.post('/narocilo/novo',
  body('narocilo_cas').notEmpty(),
  body('narocilo_opombe').isString(),
  body('stranka_id').isInt(),
  body('delavec_id').isInt(),
  body('storitev_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    if (req.body.stranka_id != req.session.user.stranka_id) {
      res.status(500).json({ status: { success: false, msg: "Na storitev lahko naročite le sebe" } })
      return
    }
    if (!req.session.logged_in) {
      res.status(200).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
      return
    }
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

router.delete('/narocilo/preklici',
  body('narocilo_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { narocilo_id } = req.body;
      const queryResult = await DB.prekliciNarocilo(narocilo_id)
      res.status(200).json(queryResult);
    } catch (err) {
      next(err)
    }
  });

router.delete('/stranka',
  async (req, res, next) => {
    try {
      if (!req.session.logged_in) {
        res.status(401).json({ status: { success: false, msg: "Uporabnik ni prijavljen" } })
        return
      }
      else {
        const queryResult = await DB.izbrisiStranko(req.session.user.stranka_id)
        res.status(200).json(queryResult);
      }
    } catch (err) {
      next(err)
    }
  });

module.exports = router;