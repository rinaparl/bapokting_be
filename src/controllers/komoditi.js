const response = require('../helpers/standardResponse');
const komoditiModel = require('../models/komoditi');
const errResponse = require('../helpers/errResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {APP_SECRET} = process.env;


exports.komoditiList= (req, res)=>{
  komoditiModel.getLastDate((err, results)=>{
    if (err) {
      return 'data kosong';
    }else{
      const lastDate = results[0] === undefined ? '' : results[0].tanggal
      const searchDate = req.query.tanggal
      komoditiModel.getAllKomoditi(lastDate, searchDate, (err, results)=>{
        if (err) {
          return 'data kosong';
        }else{
          return response(res, 'Get All Data success', results);
        }
      });
    }
  });
  
};
exports.komoditiListNaik= (req, res)=>{
  komoditiModel.getLastDate((err, results)=>{
    // results === [] ? console.log('abc') : console.log('def');
    // console.log('ini err', results);
    if (err) {
      return 'data kosong';
    }else{
      const lastDate = results[0] === undefined ? '' : results[0].tanggal
      const searchDate = req.query.tanggal
      komoditiModel.komoditiListNaik(lastDate, searchDate, (err, results)=>{
        // console.log(results);
        if (err) {
          return 'data kosong';
        }else{
          return response(res, 'Get All Data success', results.rowCount);
        }
      });
    }
  });
  
};
exports.komoditiListTurun= (req, res)=>{
  komoditiModel.getLastDate((err, results)=>{
    // results === [] ? console.log('abc') : console.log('def');
    if (err) {
      return 'data kosong';
    }else{
      const lastDate = results[0] === undefined ? '' : results[0].tanggal
      const searchDate = req.query.tanggal
      komoditiModel.komoditiListTurun(lastDate, searchDate, (err, results)=>{
        // console.log(results);
        if (err) {
          return 'data kosong';
        }else{
          return response(res, 'Get All Data success', results.rowCount);
        }
      });
    }
  });
  
};
exports.komoditiListTetap= (req, res)=>{
  komoditiModel.getLastDate((err, results)=>{
    // results === [] ? console.log('abc') : console.log('def');
    if (err) {
      return 'data kosong';
    }else{
      const lastDate = results[0] === undefined ? '' : results[0].tanggal
      const searchDate = req.query.tanggal
      komoditiModel.komoditiListTetap(lastDate, searchDate, (err, results)=>{
        // console.log(results);
        if (err) {
          return 'data kosong';
        }else{
          return response(res, 'Get All Data success', results.rowCount);
        }
      });
    }
  });
  
};
exports.komoditiListNaikTurun= (req, res)=>{
  komoditiModel.getLastDate((err, results)=>{
    if (err) {
      return 'data kosong';
    }else{
      const lastDate = results[0].tanggal
      const searchDate = req.query.tanggal
      komoditiModel.komoditiListNaikTurun(lastDate, searchDate, (err, results)=>{
        // console.log(results);
        if (err) {
          return 'data kosong';
        }else{
          return response(res, 'Get All Data success', results);
        }
      });
    }
  });
  
};

exports.komoditiAdd= (req, res)=>{
  komoditiModel.addKomoditi(req.body, (err, results)=>{
    return response(res, 'Create Komoditi Name success', results);
  });
};
exports.komoditiStatistik= (req, res)=>{
  komoditiModel.getOneData((err, results)=>{
    if (err) {
      console.log(err);
    }else{
      const id_komoditi_body = req.query.id_komoditi

      const id_komoditi = results[0] === undefined ? '' : results[0].id_komoditi;
      komoditiModel.allStatistik(id_komoditi, id_komoditi_body, (err, resultsData)=>{
        const tanggalArray = resultsData.map(obj => obj.tanggal);
        const hargaArray = resultsData.map(obj => obj.med_minggu_ini);
        const hargaInt = hargaArray.map(str => parseInt(str));
        const hargaMataUang = hargaInt.map(int => int.toLocaleString('id-ID'));
        // console.log(resultsData[0].komoditi_name);
        const komoditi_name = resultsData[0].komoditi_name
        console.log(komoditi_name);
        return response(res, 'Get All Komoditi success', {komoditi_name, tanggalArray, hargaMataUang });
      });
    }
  })
};
exports.komoditiAll= (req, res)=>{
  komoditiModel.getOneData((err, results)=>{
    // console.log(results[0].id_komoditi);
    if (err) {
      console.log(err);
    }else{
      const id_komoditi = results[0].id_komoditi;
      komoditiModel.allKomoditi(id_komoditi, (err, results)=>{
        return response(res, 'Get All Komoditi success', results);
      });
    }
  })
};
exports.komoditiAll= (req, res)=>{
  komoditiModel.allNameKomoditi((err, results)=>{
    return response(res, 'Get All Komoditi success', results);
  });
};
exports.komoditiKategori= (req, res)=>{
  komoditiModel.komoditiKategori((err, results)=>{
    return response(res, 'Get All Komoditi Kategori success', results);
  });
};

exports.komoditiPrice= (req, res)=>{
  const p_guntur = req.body.p_guntur
  const p_kadungora = req.body.p_kadungora
  const p_cikajang = req.body.p_cikajang
  const p_pamengpeuk = req.body.p_pamengpeuk
  const p_samarang = req.body.p_samarang
  const p_malangbong = req.body.p_malangbong

  const guntur      = parseInt(p_guntur)
  const kadungora   = parseInt(p_kadungora)
  const cikajang    = parseInt(p_cikajang)
  const pamengpeuk  = parseInt(p_pamengpeuk)
  const samarang    = parseInt(p_samarang)
  const malangbong  = parseInt(p_malangbong)

  const total = guntur + kadungora + cikajang + pamengpeuk + samarang + malangbong;
  const average = total / 6;
  const sendAverage = Math.floor(average)

  const rata_minggu_ini = sendAverage

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; 
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]; 
  const year = today.getFullYear();

  const tanggal = `${day} ${monthNames[month - 1]} ${year}`;

  komoditiModel.komoditiPrice(req.body, tanggal, guntur, kadungora, cikajang, pamengpeuk, samarang, malangbong,
        rata_minggu_ini, (err, results)=>{
    return response(res, 'Create Price Komoditi success', results);
  });
};

