const mysql = require('mysql')
const dbconfig = require('../config/database')
const connection = mysql.createConnection(dbconfig)
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')

module.exports = app => {
    app.post('/login', (req, res) => {
        let id = 'id'
        let pw = 'pw'

        if (!req.body.id || !req.body.pw) return res.json({ status: 402, message: 'go wrong request' })

        if (id === req.body.id && pw.req.body.pw) {
            let token = jwt.sign({ id: req.body.id }, 'secret', { expiresIn: '24h' })
            return res.json({ status: 200, message: 'get token success', token })
        } else {
            return res.json({ status: 402, message: 'do not match id with pw' })
        }
    })
}
