const db = require('../helpers/db.js');

exports.getLastDate = (cb) => {
  db.query(`SELECT tanggal FROM price ORDER BY tanggal ASC LIMIT 1`, (err, res) => {
    if(err) {
      throw err;
    }
    cb(err, res.rows);
  });
};

exports.getAllKomoditi = (lastDate, searchDate, cb) => {
  // console.log(lastDate);
  const setDate = searchDate === undefined ? lastDate : searchDate
  db.query(`SELECT price.id, komoditi_kat.komoditi_name, satuan, tanggal, p_guntur, p_kadungora, p_cikajang, p_pameungpeuk, p_samarang, p_malangbong, med_minggu_ini, med_minggu_lalu, keterangan, persentase FROM price INNER JOIN komoditi_kat ON price.id_komoditi = komoditi_kat.id WHERE price.tanggal = $1`, [setDate], (err, res) => {
    if(err) {
      throw err;
    }
    cb(err, res.rows);
  });
};
exports.komoditiListNaikTurun = (lastDate, searchDate, cb) => {
  const setDate = searchDate === undefined ? lastDate : searchDate
  db.query(`SELECT price.id, komoditi_kat.komoditi_name, satuan, tanggal, p_guntur, p_kadungora, p_cikajang, p_pameungpeuk, p_samarang, p_malangbong, med_minggu_ini, med_minggu_lalu, keterangan, persentase FROM price INNER JOIN komoditi_kat ON price.id_komoditi = komoditi_kat.id WHERE price.tanggal = $1 AND (keterangan = 'Naik' OR keterangan = 'Turun')`, [setDate], (err, res) => {
    if(err) {
      throw err;
    }
    cb(err, res.rows);
  });
};
exports.komoditiListNaik = (lastDate, searchDate, cb) => {
  const setDate = searchDate === undefined ? lastDate : searchDate
  db.query(`SELECT keterangan FROM price WHERE price.tanggal = $1 AND keterangan = 'Naik'`, [setDate], (err, res) => {
    if(err) {
      throw err;
    }
    cb(err, res);
  });
};

exports.komoditiListTurun = (lastDate, searchDate, cb) => {
  const setDate = searchDate === undefined ? lastDate : searchDate
  db.query(`SELECT keterangan FROM price WHERE price.tanggal = $1 AND keterangan = 'Turun'`, [setDate], (err, res) => {
    if(err) {
      throw err;
    }
    cb(err, res);
  });
};
exports.komoditiListTetap = (lastDate, searchDate, cb) => {
  const setDate = searchDate === undefined ? lastDate : searchDate
  db.query(`SELECT keterangan FROM price WHERE price.tanggal = $1 AND keterangan = 'Tetap'`, [setDate], (err, res) => {
    if(err) {
      throw err;
    }
    cb(err, res);
  });
};



exports.komoditiPrice = (data, tanggal, guntur, kadungora, cikajang, pamengpeuk, samarang, malangbong,
  rata_minggu_ini, cb) =>{
  db.query('BEGIN', err=>{
    if(err){
      cb(err);
    }else{
      const querSelectByIdKom = 'SELECT * FROM price where id_komoditi = $1'
      const id_komoditi = [data.id_komoditi]
      db.query(querSelectByIdKom,id_komoditi,(err,resAll)=>{
        // console.log('ini err1' , resAll);
        if(err){
          cb(err);
        }else{
          const querSelectPrev = 'SELECT * FROM price where id_komoditi = $1 order by id  LIMIT 1 OFFSET $2';
          const id_komoditi = data.id_komoditi
          const dataOffset = resAll.rowCount === 0 ? 0 : resAll.rowCount - 1
          db.query(querSelectPrev, [id_komoditi, dataOffset],(err,resPrev)=>{
            // console.log('ini err1' , resPrev);
            if(err){
              cb(err);
            }else{
              const rata_minggu_lalu = resPrev.rowCount === 0 ? 0 : parseInt(resPrev.rows[0].med_minggu_ini);
              const rata_minggu = rata_minggu_ini;
              let keterangan;
              if (rata_minggu > rata_minggu_lalu) {
                keterangan = 'Naik';
              } else if (rata_minggu < rata_minggu_lalu) {
                keterangan = 'Turun';
              } else if (rata_minggu === rata_minggu_lalu) {
                keterangan = 'Tetap';
              }
              const persentaseKurang = rata_minggu - rata_minggu_lalu;
              const persentaseBagi = persentaseKurang / rata_minggu_lalu;
              const persentaseKali = persentaseBagi * 100;
              let hasil = persentaseKali;
              hasil = hasil === Infinity ? 0 : hasil;
              console.log(hasil);
              if (hasil < 0) {
                hasil = -hasil;
              }
              hasil = hasil.toFixed(2);
              const queryPrice = `INSERT INTO price (id_komoditi, satuan, tanggal, p_guntur, p_kadungora, p_cikajang, p_pameungpeuk, p_samarang, p_malangbong, med_minggu_ini, med_minggu_lalu, keterangan, persentase ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
              const valPrice = [id_komoditi, data.satuan, tanggal, guntur, kadungora, cikajang, pamengpeuk, samarang, malangbong,
              rata_minggu_ini, rata_minggu_lalu, keterangan, hasil];
              db.query(queryPrice,valPrice,(err, resFnnal)=>{
                // console.log(err);
                if(err){
                  cb(err);
                }else{
                  cb(err,resFnnal.rows);
                  db.query('COMMIT',err=>{
                    if(err){
                      cb(err);
                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  });
};


exports.allKomoditi=(id_komoditi, cb)=>{
  const que=`SELECT tanggal from price WHERE id_komoditi = ${id_komoditi} ORDER BY id ASC`;
  db.query(que,(err,res)=>{
    if(err){
      cb(err);
    }else{
      cb(err, res.rows);
    }
  });
};
exports.allNameKomoditi=(cb)=>{
  const que=`SELECT * from komoditi_kat ORDER BY id ASC`;
  db.query(que,(err,res)=>{
    if(err){
      cb(err);
    }else{
      cb(err, res.rows);
    }
  });
};
exports.allStatistik=(id_komoditi, id_komoditi_body, cb)=>{
  const que=`
  SELECT tanggal, med_minggu_ini, komoditi_kat.komoditi_name
  FROM price
  INNER JOIN komoditi_kat ON komoditi_kat.id = price.id_komoditi
  WHERE price.id_komoditi = ${id_komoditi}
  ORDER BY price.id ASC`;
  db.query(que,(err,res)=>{
    if(err){
      cb(err);
    }else{
      cb(err, res.rows);
    }
  });
};
exports.getOneData=(cb)=>{
  const que='SELECT id_komoditi from price LIMIT 1';
  db.query(que,(err,res)=>{
    if(err){
      cb(err);
    }else{
      cb(err, res.rows);
    }
  });
};

exports.komoditiKategori=(cb)=>{
  const que='SELECT * from komoditi_kat ORDER BY komoditi_name ASC';
  db.query(que,(err,res)=>{
    if(err){
      cb(err);
    }else{
      cb(err, res.rows);
    }
  });
};
exports.addKomoditi = (data, cb)=>{
  const quer = 'INSERT INTO komoditi_kat (komoditi_name, value, label) VALUES ($1, $2, $3) RETURNING *';
  const value = [data.komoditi_name, data.komoditi_name, data.komoditi_name];
  db.query(quer, value, (err, res)=>{
    // console.log(value);
    if(err) {
      throw err;
    }
    cb(err, res.rows);
  });
};
