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

router.post("/get-cart", function (req, res) {

    if (req.session.user) {

        let query = `SELECT product_id, quantity, price FROM cart_item WHERE user_id = '${req.session.user.user_id}';`
        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection/n' + error });
            }
            else {
                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: 'Error in query/n' + error });
                    }
                    else if (result.length == 0) {
                        res.send({ message: "empty-cart" });
                    }
                    else if (result.length > 0) {
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


router.post("/add-to-cart", function (req, res) {

    if (req.session.user) {

        const { product_id } = req.body;
        let price;

        let query = `SELECT price FROM product WHERE product_id = '${product_id}';`
        connection.query(query, function (error, result) {
            if (error) {
                res.send({ message: 'Error in query/n' + error });
            }
            else if (result.length > 0) {

                price = result[0].price;

                let query = `INSERT INTO cart_item (user_id, product_id, quantity, price) VALUES ('${req.session.user.user_id}', '${product_id}', '1', '${price}');`;
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
        });
    }

    else {
        res.send({ message: "not_logged" });
    }
});


router.post("/update-cart", function (req, res) {

    if (req.session.user) {

        const { product_id, quantity } = req.body;

        let query = `SELECT * FROM cart_item WHERE product_id = '${product_id}' AND user_id = '${req.session.user.user_id}';`
        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection/n' + error });
            }
            else {
                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: 'Error in query/n' + error });
                    }
                    else if (result.length == 0) {
                        res.send({ message: "item_not_found" });
                    }
                    else if (result.length > 0) {

                        let query = `UPDATE cart_item SET quantity = '${quantity}' WHERE product_id = '${product_id}' AND user_id = '${req.session.user.user_id}';`
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
                });
            }
        });

    }
    else {
        res.send({ message: "not_logged" });
    }

});


router.post("/delete-cart", function (req, res) {

    if (req.session.user) {

        query = `DELETE FROM cart_item WHERE user_id = '${req.session.user.user_id}';`;

        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection/n' + error });
            }
            else {

                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: "Error in query \n" + error });
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

router.post("/delete-from-cart", function (req, res) {

    if (req.session.user) {

        const { product_id } = req.body;

        query = `DELETE FROM cart_item WHERE user_id = '${req.session.user.user_id}' AND product_id ='${product_id}';`;

        connection.connect(function (error) {
            if (error) {
                res.send({ message: 'Error in connection/n' + error });
            }
            else {

                connection.query(query, function (error, result) {
                    if (error) {
                        res.send({ message: "Error in query \n" + error });
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
