const mysql = require('mysql')
const dbconfig = require('../config/database')
const connection = mysql.createConnection(dbconfig)
const path = require('path')
const fs = require('fs')

// file upload
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let upload = path.join(__dirname, `../images/developerBoard`)
        cb(null, upload)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = app => {
    app.post('/developerList', (req, res) => {
        if (!req.body.limit || !req.body.offset) return res.json({ status: 402, message: 'go wrong request' })

        if (!req.body.search) {
            let sql = `SELECT * from developer orders LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
            let sql2 = `SELECT COUNT(*) from developer`
            connection.query(sql, (err, result) => {
                if (err) return res.json({ status: 500, message: 'list call server error' })
                if (result.length === 0) return res.json({ status: 404, message: 'not content' })
                connection.query(sql2, (err2, result2) => {
                    if (err2) return res.json({ status: 500, message: 'total err' })
                    let total = result2[0]['COUNT(*)']
                    return res.json({
                        status: 200,
                        message: 'get developer success',
                        result,
                        total
                    })
                })
            })
        }

        if (req.body.search) {
            let sql = `SELECT * from developer where ${req.body.type} like "%${req.body.search}%" LIMIT ${req.body.offset}, ${req.body.limit}`
            let sql2 = `SELECT COUNT(*) from developer where ${req.body.type} like "%${req.body.search}%"`
            connection.query(sql, (err, result) => {
                if (err) return res.json({ status: 500, message: 'search list call server error' })
                if (!result) return res.json({ status: 404, message: 'not content' })
                connection.query(sql2, (err2, result2) => {
                    if (err2) return res.json({ status: 500, message: 'total err' })
                    let total = result2[0]['COUNT(*)']
                    return res.json({
                        status: 200,
                        message: 'get title search developerList success',
                        result,
                        total
                    })
                })
            })
        }
    })

    app.post('/developerDetail', (req, res) => {
        if (!req.body.seq) return res.json({ status: 402, message: 'go wrong request' })

        let sql = `SELECT * FROM developer where seq=${req.body.seq}`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'detail developer server error' })
            return res.json({ status: 200, message: 'success data info', result })
        })
    })

    app.post('/developerDelete', (req, res) => {
        if (!req.body.seq) return res.json({ status: 402, message: 'go wrong request' })

        let sql = `DELETE FROM developer from seq=${req.body.seq}`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'delete developer server error' })
            return res.json({ status: 200, message: 'success delete info' })
        })
    })

    app.post('/developerInsert', upload.single('file'), (req, res) => {
        let data = JSON.parse(req.body.info)
        if (!data.title || !data.place || !data.content || !data.sample || !req.file.filename)
            return res.json({ status: 402, message: 'go wrong request' })

        let sql = `INSERT INTO developer(title, sub_title, content, sample, img) VALUE ('${data.title}', '${data.place}','${data.content}', '${data.sample}', '${req.file.filename}')`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'insert developer server error' })
            return res.json({ status: 200, message: 'success data insert' })
        })
    })
}
