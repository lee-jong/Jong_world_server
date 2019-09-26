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
        if (req.body.offset === undefined || !req.body.limit)
            return res.json({ status: 402, message: 'go wrong request' })

        if (!req.body.search) {
            let sql = `SELECT * from imgTable orders LIMIT ${req.body.limit} OFFSET ${req.body.offset}`
            let sql2 = `SELECT COUNT(*) from imgTable`
            connection.query(sql, (err, result) => {
                if (err) return res.json({ status: 500, message: 'list call server error' })
                if (!result) return res.json({ status: 404, message: 'not content' })

                connection.query(sql2, (err2, result2) => {
                    if (err2) return res.json({ status: 500, message: 'total err' })
                    let total = result2[0]['COUNT(*)']
                    return res.json({
                        status: 200,
                        message: 'get imgList success',
                        result,
                        total
                    })
                })
            })
        }

        if (req.body.search) {
            let sql = `SELECT * from imgTable where ${req.body.type} like "%${req.body.search}%" LIMIT ${req.body.offset}, ${req.body.limit}`
            let sql2 = `SELECT COUNT(*) from imgTable where ${req.body.type} like "%${req.body.search}%"`
            connection.query(sql, (err, result) => {
                if (err) return res.json({ status: 500, message: 'search list call server error' })
                if (!result) return res.json({ status: 404, message: 'not content' })
                connection.query(sql2, (err2, result2) => {
                    if (err2) return res.json({ status: 500, message: 'total err' })
                    let total = result2[0]['COUNT(*)']
                    return res.json({
                        status: 200,
                        message: 'get title search imgList success',
                        result,
                        total
                    })
                })
            })
        }
    })

    app.post('/imgInsert', upload.single('file'), (req, res) => {
        let data = JSON.parse(req.body.info)
        if (!data.title || !data.place || !data.content || !req.file.filename)
            return res.json({ status: 402, message: 'go wrong request' })

        let sql = `INSERT INTO imgTable(title, sub_title, content, img) VALUE ('${data.title}', '${data.place}', '${data.content}', '${req.file.filename}')`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'insert image server error' })
            return res.json({ status: 200, message: 'success data insert' })
        })
    })

    app.post('/deleteImg', (req, res) => {
        if (!req.body.seq) return res.json({ status: 402, message: 'go wrong request' })

        let sql = `delete from imgtable where seq =${req.body.seq}`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ status: 500, message: 'delete image server error' })
            fs.unlinkSync(path.join(__dirname, `../images/imgBoard/${req.body.img}`))
            return res.json({ status: 200, message: 'success delete image' })
        })
    })
}
