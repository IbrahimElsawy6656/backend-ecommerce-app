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


router.post("/get-all-orders", function (req, res) {

    let query = `SELECT * FROM orders;`;
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
                } else if (result.length === 0) {
                    res.send({ message: 'empty_cart' });
                }
                else {
                    res.send(result);
                }
            });
        }
    });
});

router.post("/get-my-order", function (req, res) {

    if (req.session.user) {

        let query = `SELECT * FROM orders WHERE user_id = '${req.session.user.user_id}';`;

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
                    } else if (result.length === 0) {
                        res.send({ message: 'no_orders' });
                    }
                    else {
                        res.send(result);
                    }
                });
            }
        });
    }
});


router.post("/add-order", function (req, res) {

    if (req.session.user) {

        let query = `SELECT product_id, quantity, price FROM cart_item WHERE user_id = '${req.session.user.user_id}';`
        connection.connect(function (error) {

            if (error) {
                res.send({ message: 'Error in connection\n' + error });
            }
            else {

                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: 'Error in query\n' + error });
                    }
                    else if (result.length === 0) {
                        res.send({ message: "empty_cart" });
                    }
                    else {

                        let amount = 0;
                        result.map(item => {
                            amount += item.price * item.quantity;
                        });

                        const cartResult = result;

                        if (req.body.promo_code !== '') {

                            query = `SELECT discount, promo_id FROM promo WHERE promo_code = '${req.body.promo_code}' AND status = 'valid'`;

                            connection.query(query, function (error, result) {
                                if (error) {
                                    res.send({ message: 'Error in query\n' + error });
                                }
                                else if (result.length > 0) {

                                    //check quantity

                                    amount *= (1 - result[0].discount * 0.01);

                                    query = `INSERT INTO orders (user_id, promo_id, order_details, status, amount) VALUES ('${req.session.user.user_id}','${result[0].promo_id}','${JSON.stringify(cartResult)}','Not Confirmed','${amount}');`;

                                    connection.query(query, function (error, result) {
                                        if (error) {
                                            res.send({ message: 'Error in query\n' + error });
                                        }
                                        else {
                                            res.send(result);
                                        }
                                    });

                                }
                                else {
                                    res.send({ message: 'invalid_promo' });
                                }
                            });
                        }

                        else {

                            query = `INSERT INTO orders (user_id, promo_id, order_details, status, amount) VALUES ('${req.session.user.user_id}','1','${JSON.stringify(cartResult)}','Not Confirmed','${amount}');`;

                            connection.query(query, function (error, result) {
                                if (error) {
                                    res.send({ message: 'Error in query\n' + error });
                                }
                                else {
                                    res.send(result);
                                }
                            });
                        }

                    }
                });
            }
        });
    }
    else {
        res.send({ message: "not_logged" });
    }


});


router.post("/delete-order", function (req, res) {

    if (req.session.user) {

        query = `DELETE FROM orders WHERE user_id = '${req.session.user.user_id}';`;

        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection\n' + error });
            }
            else {

                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: 'Error in query\n' + error });
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


module.exports = router;
