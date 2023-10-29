const Listing = require("./models/listing.js");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you need to logged in to add!");
       return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        // console.log(result);
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
}
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
        // console.log(result);
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you did not create this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}