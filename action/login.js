const mysql = require('mysql')
const dbconfig = require('../config/database')
const connection = mysql.createConnection(dbconfig)
const jwt = require('jsonwebtoken')

module.exports = app => {
    app.post('/getToken', (req, res) => {
        if (!req.body.id || !req.body.pw) return res.json({ status: 402, message: 'go wrong request' })
        let sql = `select * from user where id = '${req.body.id}'`
        connection.query(sql, (err, result) => {
            if (err) return res.json({ message: 'err', err })
            if (result[0].pw !== req.body.pw) return res.json({ status: 402, message: 'go wrong request pw' })

            let token = jwt.sign({ id: req.body.id }, 'secret', { expiresIn: '12h' })
            return res.json({ status: 200, message: 'login success', token })
        })
    })

    app.post('/vaildToken', (req, res) => {
        let token = req.body.token
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.json({ status: 401, message: 'Token is not valid' })
            } else {
                console.log('check', decoded)
                return res.json({ status: 200, message: 'Token is valid', decoded })
            }
        })
    })
}
