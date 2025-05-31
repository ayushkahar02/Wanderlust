const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing_schema.js")


const DB_URL = "mongodb://localhost:27017/wanderlust";
async function main(){
    await mongoose.connect(DB_URL);
}

main()
.then(()=>{
    console.log("Connected to succssfully");
}).catch(err =>{
    console.error(err);
});

const initDB =async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    
    console.log("data was initialized");
    
}

initDB();