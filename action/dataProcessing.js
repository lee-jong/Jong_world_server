const mysql = require('mysql')
const dbconfig = require('../config/database')
const connection = mysql.createConnection(dbconfig)

module.exports = app => {
    app.post('/getBEList', (req, res) => {
        const { offset, limit, search, BE_name } = req.body

        if (!offset || !limit) return res.json({ status: 402, message: 'go wrong request' })

        if (!search) {
            let sql = `SELECT * from  BEList orders LIMIT ${limit} OFFSET ${offset}`
            let sql2 = `SELECT COUNT(*) from BEList`
            connection.query(sql, (err, result) => {
                if (err) return res.json({ status: 500, message: 'list BE server error' })
                if (!result) return res.json({ status: 404, message: 'not content' })

                connection.query(sql2, (err2, result2) => {
                    if (err2) return res.json({ status: 500, message: 'total err' })
                    let total = result2[0]['COUNT(*)']
                    return res.json({
                        status: 200,
                        message: 'get BEList success',
                        result,
                        total
                    })
                })
            })
        }

        if (search) {
            let sql = `SELECT * from BEList where ${BE_name} like "%${search}%" LIMIT ${offset}, ${limit}`
            let sql2 = `SELECT COUNT(*) from BEList where ${BE_name} like "%${search}%"`
            connection.query(sql, (err, result) => {
                if (err) return res.json({ status: 500, message: 'search BE call server error' })
                if (!result) return res.json({ status: 404, message: 'not content' })
                connection.query(sql2, (err2, result2) => {
                    if (err2) return res.json({ status: 500, message: 'total err' })
                    let total = result2[0]['COUNT(*)']
                    return res.json({
                        status: 200,
                        message: 'get name search BE success',
                        result,
                        total
                    })
                })
            })
        }
    })

    app.post('/insertBE', (req, res) => {
        const { BE_name, BE_BE_name, BE_adress, BE_BLN, BE_phone } = req.body
        if (!BE_name || !BE_BE_name || !BE_adress || !BE_BLN || !BE_phone)
            return res.json({ status: 402, message: 'go wrong request' })

        let sql = `INSERT INTO BEList(BE_name, BE_BE_name, BE_address, BE_BLN, BE_phone) value ('${BE_name}', '${BE_BE_name}', '${BE_adress}', '${BE_BLN}', '${BE_phone}')`

        connection.query(sql, (err, result) => {
            if (err) return res.json({ message: 'err', err })
            return res.json({ status: 200, message: 'login success' })
        })
    })

    app.post('/modifyBE', (req, res) => {
        const { seq, BE_name, BE_BE_name, BE_adress, BE_BLN, BE_phone } = req.body

        let sql = `SELECT * FROM BEList where seq = ${seq}`
        // 빈 값일 떄, select 한 거에서 불러서 빈 값 채우기
    })
}
