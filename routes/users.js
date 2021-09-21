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


router.post("/isAuth", function (req, res) {

    console.log(req.session);

    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
        console.log("hna");
    }
    else {
        res.send({ loggedIn: false });
    }
});



router.post("/get-all-users", function (req, res) {

    let query = `SELECT * FROM users WHERE type = 'client';`;
    connection.connect(function (error) {

        if (error) {
            res.send({ message: 'Error in connection\n' + error });
        }
        else {
            connection.query(query, function (error, result) {
                if (error) {
                    res.send({
                        message: 'Error in query\n' + error
                    });
                } else {
                    res.send(result);
                }
            });
        }
    });
});


router.post("/login", function (req, res) {

    const { email, password } = req.body;

    let query = `SELECT * FROM users WHERE email = '${email}';`;

    connection.connect(function (error) {
        if (error) {
            res.send({ message: 'Error in connection\n' + error });
        }
        else {
            connection.query(query, function (error, result) {

                if (error) {
                    res.send({
                        message: 'Error in query\n' + error
                    });
                } else if (result.length > 0) {
                    if (result[0].password === password) {
                        req.session.user = result[0];
                        res.send(result[0]);
                    }
                    else {
                        res.send({
                            message: 'Username or password is invalid'
                        });
                    }

                }
                else {
                    res.send({
                        message: 'Email entered is not registered'
                    })
                }
            });
        }
    });
});

router.post("/logout", function (req, res) {

    if (req.session.user) {

        req.session.user = null;
        res.send({ message: "logged_out" });
    }
    else
        res.send({ message: "not_logged" })
});


router.post("/add-user", function (req, res) {

    const { email, full_name, date_of_birth, phone, address, password } = req.body;

    console.log(email, password);
    let query = `INSERT INTO users (email, full_name, date_of_birth, phone, address, password, type) VALUES ('${email}','${full_name}','${date_of_birth}','${phone}','${address}','${password}','client');`;
    connection.connect(function (error) {
        if (error) {
            res.send({ message: 'Error in connection\n' + error });
        }
        else {
            connection.query(query, function (error, result) {
                if (error) {
                    res.send({ message: 'Error in query\n' + error });
                } else {
                    res.send(result);
                }
            });
        }
    });
});


module.exports = router;
