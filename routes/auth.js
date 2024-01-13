const express = require('express');
const router = express.Router();
const DB = require('../db/dbConn');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

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

router.post('/delavec/prijava',
  body('eposta').isEmail(),
  body('geslo').isString(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { eposta, geslo } = req.body;
      if (eposta && geslo) {
        const queryResult = await DB.authDelavec(eposta)
        if (queryResult.length > 0 && queryResult[0].delavec_geslo) {
          const match = await bcrypt.compare(geslo, queryResult[0].delavec_geslo);
          if (match) {
            req.session.user = queryResult[0];
            req.session.logged_in = true;

            req.session.save((err) => {
              if (err) {
                console.log("SEJE NE SHRANI: " + err)
              }
              return res.status(200).json({ delavec: queryResult[0], status: { success: true, msg: "Prijava uspešna" } })
            })

          } else {
            res.status(200).json({ delavec: null, status: { success: false, msg: "Napačni podatki" } }) // geslo ali uporabniško ime napačno
          }
        } else {
          res.status(200).send({ delavec: null, status: { success: false, msg: "Napačni podatki" } }) // uporabnik ni registriran
        }
      } else {
        res.status(200).send({ delavec: null, status: { success: false, msg: "Vnesite vse podatke" } })
      }
    } catch (error) {
      next(error);
    }
  });

router.post('/admin/prijava',
  body('uporabnisko').isString(),
  body('geslo').isString(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { uporabnisko, geslo } = req.body;
      if (uporabnisko && geslo) {
        const queryResult = await DB.authPodjetje(uporabnisko)
        if (queryResult.length > 0 && queryResult[0].podjetje_geslo) {
          const match = await bcrypt.compare(geslo, queryResult[0].podjetje_geslo);
          if (match) {
            req.session.admin = queryResult[0];
            req.session.is_admin = true;

            req.session.save((err) => {
              if (err) {
                console.log("SEJE NE SHRANI: " + err)
              }
              return res.status(200).json({ podjetje: queryResult[0], status: { success: true, msg: "Prijava uspešna" } })
            })

          } else {
            res.status(200).json({ podjetje: null, status: { success: false, msg: "Napačni podatki" } }) // geslo ali uporabniško ime napačno
          }
        } else {
          res.status(200).send({ podjetje: null, status: { success: false, msg: "Napačni podatki" } }) // uporabnik ni registriran
        }
      } else {
        res.status(200).send({ podjetje: null, status: { success: false, msg: "Vnesite vse podatke" } })
      }
    } catch (error) {
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
  body('telefon').notEmpty(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { ime, priimek, eposta, geslo, telefon } = req.body;
      const queryResult = await DB.registracijaStranka(ime, priimek, eposta, geslo, telefon);
      res.status(200).json({ stranka: queryResult, status: { success: true, msg: "Stranka ustvarjena" } });
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
      next()
    }
  });

router.post('/delavec/registracija',
  body('delavec_ime').notEmpty(),
  body('delavec_priimek').notEmpty(),
  body('delavec_slika').notEmpty(),
  body('delavec_eposta').isEmail(),
  body('delavec_geslo').isLength({ min: 8 }),
  body('delavec_telefon').notEmpty(),
  body('podjetje_id').isInt(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { delavec_ime, delavec_priimek, delavec_slika, delavec_eposta, delavec_geslo, delavec_telefon, podjetje_id } = req.body;
      const queryResult = await DB.registracijaDelavec(delavec_ime, delavec_priimek, delavec_slika, delavec_eposta, delavec_geslo, delavec_telefon, podjetje_id);
      res.status(200).json({ delavec: queryResult, status: { success: true, msg: "Delavec ustvarjen" } });
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
      next()
    }
  });

router.post('/podjetje/registracija',
  body('podjetje_naziv').notEmpty(),
  body('podjetje_admin').notEmpty(),
  body('podjetje_geslo').isLength({ min: 8 }),
  body('podjetje_naslov').notEmpty(),
  body('podjetje_slika').notEmpty(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { podjetje_naziv, podjetje_admin, podjetje_geslo, podjetje_naslov, podjetje_slika } = req.body;

      const queryResult = await DB.registracijaPodjetje(podjetje_naziv, podjetje_admin, podjetje_geslo, podjetje_naslov, podjetje_slika);
      res.status(200).json({ podjetje: queryResult, status: { success: true, msg: "Podjetje ustvarjeno" } });
    } catch (err) {
      console.log(err)
      res.sendStatus(500)
      next()
    }
  });

module.exports = router;