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

    app.post('/searchImgBoard', (req, res) => {
        let sql = `SELECT * from imgTable where title like "%${req.body.search}%"`
        let sql2 = `SELECT * from imgTable where sub_title like "%${req.body.search}%"`
        let sql3 = `SELECT * from imgTable where content like "%${req.body.search}%"`
        let sql4 = `SELECT * from imgTable where date like "%${req.body.search}%"`

        switch(req.body.type){
            case 'title' : 
            connection.query(sql, (err, result) => {
                if(err) return  res.json({ status:500, message : 'search list call server error'})
                if(!result) return res.json({status : 404, message : 'not content'})
                res.json({status:200, message : 'get search imgList success'})
               break; 
            })

            case 'sub_title' : 
            connection.query(sql2, (err, result) => {
                if(err) return  res.json({ status:500, message : 'search list call server error'})
                if(!result) return res.json({status : 404, message : 'not content'})
                res.json({status:200, message : 'get search imgList success'})
               break; 
            })

            case 'content' : 
            connection.query(sql3, (err, result) => {
                if(err) return  res.json({ status:500, message : 'search list call server error'})
                if(!result) return res.json({status : 404, message : 'not content'})
                res.json({status:200, message : 'get search imgList success'})
               break; 
            })
            //data로 하는 것이기에 check 해봐야함
            case 'date' : 
            connection.query(sql4, (err, result) => {
                if(err) return  res.json({ status:500, message : 'search list call server error'})
                if(!result) return res.json({status : 404, message : 'not content'})
                res.json({status:200, message : 'get search imgList success'})
               break; 
            })
        }
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
