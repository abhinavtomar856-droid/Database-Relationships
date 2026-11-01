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

//Post middleware.
customerSchema.post("findOneAndDelete", async (custdata)=>{
    if(custdata.orders.length){
        let res = await order.deleteMany({_id:{$in : custdata.orders}});
        console.log(res);   
    }
})

const order = mongoose.model("order",orderSchema);
const customer = mongoose.model("customer",customerSchema);

const addorder = async() =>{
    let res = await order.insertMany([
        {item : "Samosa" , price:12},
        {item: "chips" ,price:10},
        {item : "chocolate", price:40},
    ]);
    console.log(res);
};

addorder();

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

const delCust = async() =>{
    let data = await customer.findByIdAndDelete("6ae703ba05c11c57293215a7");
    console.log("Data deleted Successfully");
}

delCust();

