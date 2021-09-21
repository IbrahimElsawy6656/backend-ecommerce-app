var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

/**
* Connect to DB
*/
const connection = mysql.createConnection({
    host: 'sql4.freesqldatabase.com',
    user: 'sql4438629',
    password: '1MRH6KKGMt',
    database: 'sql4438629',
    port: 3306,
    insecureAuth: true
});


//localhost:5001/promo/add-promo body!!
router.post("/add-promo", function (req, res) {

    if (req.session.user) {

        const { promo_code, discount } = req.body;

        let query = `INSERT INTO promo (promo_code, discount, status) VALUES ('${promo_code}','${discount}','valid');`;

        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection/n' + error });
            }
            else {
                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: 'Error in query/n' + error });
                    }
                    else {
                        res.send(result);
                    }
                });
            }
        });

    }
    else {
        res.send({ message: "not_logged" });
    }
});

router.post("/update-promo", function (req, res) {

    if (req.session.user) {

        const { promo_code, discount } = req.body;

        let query = `UPDATE promo SET status = '${req.body.status}' WHERE promo_code = '${req.body.promo_code}';`;

        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection/n' + error });
            }
            else {
                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: 'Error in query/n' + error });
                    }
                    else if (result === 0) {
                        res.send("invalid_promo");
                    }
                    else {
                        res.send(result);
                    }
                });
            }
        });

    }
    else {
        res.send({ message: "not_logged" });
    }
});

router.post("/check-promo", function (req, res) {

    query = `SELECT discount, promo_id FROM promo WHERE promo_code = '${req.body.promo_code}' AND status = 'valid'`;

    connection.query(query, function (error, result) {
        if (error) {
            res.send({ message: 'Error in query\n' + error });
        }
        else if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: 'This promo code is not valid' });
        }

    });
});

module.exports = router;
