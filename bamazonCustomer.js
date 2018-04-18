var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "mbfijrwT1!",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});
var quantArr = [];

function start() {
    quantArr = [];
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        console.log(`\n=================================\n=  Items Available to Purchase  =\n=================================\n`);
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id}: ${res[i].product_name}, ${res[i].stock_quantity} available, $${res[i].price}`);
            quantArr.push({product: res[i].product_name, quantity: res[i].stock_quantity, price: res[i].price});
        }
        console.log(`\n`);
        whichItem();
    });
}

function whichItem() {
    inquirer
        .prompt([{
                name: "which_item",
                type: "input",
                message: "Enter the ID number of the item you would like to purchase:"
            },
            {
                name: "how_many",
                type: "input",
                message: "Enter the purchase quantity:"
            }
        ])
        .then(function (user) {
            var adjID = user.which_item - 1;
            // console.log(adjID);
            // console.log(quantArr[adjID]);
            if (user.how_many > quantArr[adjID].quantity) {
                console.log(`\nI'm sorry, only ${quantArr[adjID].quantity} available.`);
                start();
            } else {
                var totalPrice = user.how_many * quantArr[adjID].price;
                console.log(`\nYour order has been placed!\nItem: ${quantArr[adjID].product}\nQuantity Purchased: ${user.how_many}\nTotal Price: $${totalPrice}\n`);
                var newQuant = quantArr[adjID].quantity - user.how_many;
                connection.query("UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newQuant
                  },
                  {
                    item_id: user.which_item
                  }
                ], function (err, res) {
                    console.log(`\n***  Thank You For Your Purchase!  ***\n`)
                });
                connection.end();
            }
        });
}