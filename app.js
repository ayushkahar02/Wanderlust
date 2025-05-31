const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");   
const Listing = require("./models/listing_schema");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./joiSchema");   // joiSchema // reviewSchema
const Review = require("./models/reviews_schema");




const DB_URL = "mongodb://localhost:27017/wanderlust";
async function main(){
   await mongoose.connect(DB_URL);
}

main()
.then(()=>{
    console.log("Connected to MongoDB");
}).catch(err =>{
    console.error(err);
});


//Listing
// app.get("/listings" ,async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "Sample Listing",
//         description : "This is a sample listing",
//         price : 100,
//         location : "Sample Location",
//         country : "Sample Country",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Sample was saved");
// });


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


// we moved image inside listing object
app.use((req, res, next) => {
    if (req.body.image !== undefined) {
        req.body.listing = req.body.listing || {}; // Ensure listing object exists
        req.body.listing.image = req.body.image;   // Move image inside listing
        delete req.body.image;                     // Remove the external image field
    }
    next();
});

// app.post("/listings", (req, res, next) => {
//     console.log(req.body);
//     next();
// });

// server side listing validation
let validationListings = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,400);
    }else{
        next();
    }
};

//server side review validation
let validationReviews = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,400);
    }else{
        next();
    }
};


// 3) to get form to create new listing (new route)
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})

app.post("/listings", validationListings, wrapAsync(async (req,res,next)=>{
   // For server side Schema validation we use joi(npm pkg) (if data is send through postman);
   
    console.log(req.body);
    let listing = req.body.listing;
    await new Listing(listing).save();
    res.redirect("/listings"); 
   
}));

// 1) to get all listings (index route)

app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

// 2) to get data of specific listing (show route)
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
    
}));

//3) Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));
app.put("/listings/:id", validationListings,wrapAsync(async (req,res)=>{
    
    const {id} = req.params;
    const listing = req.body.listing;

    await Listing.findByIdAndUpdate(id,{...listing});

    res.redirect(`/listings/${id}`);

}));

//4) Delete route

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const lisitng = await Listing.findByIdAndDelete(id);
    console.log(lisitng);
    res.redirect("/listings");
}));

//REVIEWS

//5) Reviews post route
app.post("/listings/:id/reviews",validationReviews,wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    await listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//6) review delete route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync( async(req,res)=>{
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId} })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found",404));
})

//Middleware to handle errors
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went wrong"} = err;
    console.log("Staus code : " ,statusCode);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

