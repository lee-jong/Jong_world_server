const mysql = require('mysql')
const dbconfig = require('../config/database')
const connection = mysql.createConnection(dbconfig)
const path = require('path')
const fs = require('fs')

// file upload
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let upload = path.join(__dirname, `../images/imgBoard`)
        cb(null, upload)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = app => {
    app.post('/imgBoard', (req, res) => {
        let sql = `SELECT * from imgTable orders LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
        let sql2 = `SELECT COUNT(*) from imgTable`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'list call server error' })
            if (!result) return res.json({ status: 404, message: 'not content' })

            connection.query(sql2, (err2, result2) => {
                if (err2) return res.json({ status: 500, message: 'err' })
                let total = result2[0]['COUNT(*)']
                return res.send({
                    status: 200,
                    message: 'get imgList success',
                    result,
                    total
                })
            })
        })
    })

    app.post('/imgInsert', upload.single('file'), (req, res) => {
        let data = JSON.parse(req.body.info)
        let sql = `INSERT INTO imgTable(title, sub_title, content, img) VALUE ('${data.title}', '${data.place}', '${data.content}', '${req.file.filename}')`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'insert image server error' })
            console.log('one image recode inserted')
            return res.json({ status: 200, message: 'success data insert' })
        })
    })

    app.post('/deleteImg', (req, res) => {
        let seq = `delete from imgtable where seq =${req.body.seq}`
        connection.query(seq, (err, result) => {
            if (err) return res.json({ status: 500, message: 'delete image server error' })
            fs.unlinkSync(path.join(__dirname, `../images/imgBoard/${req.body.img}`))
            return res.json({ status: 200, message: 'success delete image' })
        })
    })
}
