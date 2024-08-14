const komoditi = require('express').Router();
const authMiddle = require('../middleware/auth');
/* eslint-enable no-unused-vars */
const { body } = require('express-validator');
const komoditiController = require('../controllers/komoditi');
const validationCheck = require('../middleware/checkValidation');

komoditi.post('/komoditi-add', authMiddle, validationCheck, komoditiController.komoditiAdd);
komoditi.get('/komoditi-all', komoditiController.komoditiAll);

komoditi.get('/komoditi-statistik', komoditiController.komoditiStatistik);
komoditi.post('/komoditi-price', authMiddle, validationCheck, komoditiController.komoditiPrice);
komoditi.get('/list', komoditiController.komoditiList);
komoditi.get('/list-naik', komoditiController.komoditiListNaik);
komoditi.get('/list-turun', komoditiController.komoditiListTurun);
komoditi.get('/list-tetap', komoditiController.komoditiListTetap);
komoditi.get('/list-naik-turun', komoditiController.komoditiListNaikTurun);
komoditi.get('/kategori', authMiddle, validationCheck, komoditiController.komoditiKategori);

module.exports = komoditi;