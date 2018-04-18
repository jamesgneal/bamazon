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
            console.log(`${res[i].item_id} ${res[i].product_name} ${res[i].department_name} $${res[i].price} ${res[i].stock_quantity}`);
            quantArr.push(res[i].stock_quantity);
        }
        whichItem();
    });
}

function whichItem() {
    inquirer
        .prompt([{
            name: "which_item",
            type: "input",
            message: "Enter the ID number of the item you would like to purchase: "
        },
        {
            name: "how_many",
            type: "input",
            message: "Enter the purchase quantity: "
        }])
        .then(function (user) {
            var adjID = user.which_item - 1;
            // console.log(adjID);
            // console.log(quantArr[adjID]);
            if (user.how_many > quantArr[adjID]) {
                console.log(`I'm sorry, only ${quantArr[adjID]} available.`)
                start();
            }
        });
}