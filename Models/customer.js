const mongoose = require("mongoose");
const{Schema} = mongoose

main()
.then(()=>console.log("Database was connected successfully"))
.catch((err)=> console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/relation');
}

const orderSchema = new mongoose.Schema({
    item : String,
    price : Number,
})


const customerSchema = new Schema({
    name : String,
    orders : [
        {
            type : Schema.Types.ObjectId,
            ref  : "order",
        }
    ]
})

const order = mongoose.model("order",orderSchema);
const customer = mongoose.model("customer",customerSchema);

const addCustomer = async() =>{
    let cust1 = new customer({
        name : "Abhinav Tomar"
    })

    let order1 = await order.findOne({item:"Samosa",price:12})
    let order2 = await order.findOne({item:"chips",price:10})
    let order3 = await order.findOne({item:"chocolate",price:40})

    cust1.orders.push(order1);
    cust1.orders.push(order2);
    cust1.orders.push(order3);
    let res = await cust1.save();
    console.log(res);
}

addCustomer()

//Using populate method.
const findCustomer = async() =>{
    let res = await customer.find({}).populate("orders")
    console.log(res[0]);
}

findCustomer();

const addorder = async() =>{
    let res = await order.insertMany([
        {item : "Samosa" , price:12},
        {item: "chips" ,price:10},
        {item : "chocolate", price:40},
    ]);
    console.log(res);
};

addorder();