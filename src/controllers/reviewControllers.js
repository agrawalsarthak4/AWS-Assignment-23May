const reviewModel = require("../models/reviewModel")
const booksModel = require("../models/booksModel")
const mongoose = require('mongoose');

// create Review
const createReview = async function (req, res) {
    try {
      let data = req.body;
      let bookId = req.params.bookId;
      let date = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(req.body.reviewedAt)
      let ratings = /[0-5]/.test(req.body.rating)
    if (Object.keys(data).length == 0) return res.status(400).send({ staus: false, message: "Invalid request. Please provide Details" })
    if (!data.bookId) { return res.status(400).send({ status: false, message: "BookId is required and provide details" }) }
    if (!data.rating) { return res.status(400).send({ status: false, message: "rating is required" }) }
    if (!data.review) { return res.status(400).send({ status: false, message: "review is required" }) }
    if(data.bookId!=bookId){ return res.status(400).send({ status: false, message: "plz provide valid bookid should be equal in body and param" })}
    if (data.reviewedBy == false) { return res.status(400).send({ status: false, message: "Please provide  reviwedBy name details ." }) }
    if (date === false) return res.status(400).send({ staus: false, message: "Please Enter valid date formaat yyyy-mm-dd." })
     if (ratings === false) return res.status(400).send({ staus: false, message: "Please Mention rating Number [0-5] only " })
    if (data.review == 0) return res.status(400).send({ staus: false, message: "Please provide reviwes details" })

    let book = await booksModel.findOne({ _id: data.bookId, isDeleted: false })
    if (!book) { return res.status(400).send({ status: false, message: "No book exist with this id" }) }
    let createData = await reviewModel.create(data);

    const updateReview = await booksModel.findOneAndUpdate({ _id: data.bookId, isDeleted: false }, { $inc:{reviews:1}}, { new: true })


    const { title, excerpt, userId, category, reviews, subcategory, deletedAt, isDeleted, releasedAt, createdAt, updatedAt } = updateReview
    let details = { title, excerpt, userId, category, reviews, subcategory, deletedAt, isDeleted, releasedAt, createdAt, updatedAt }


    details["reviewData"] = [createData]
    return res.status(201).send({ status: true, data: details })


    } catch (err) {
        res.status(500).send({ status: false, message: "Server not responding", error: err.message });
    }
}

// Update Review
const updateReviewById = async function (req, res) {
    try {
        let data = req.params.bookId;
        let data1 = req.params.reviewId;
        let updateData = req.body
        if (Object.keys(updateData).length == 0) return res.status(400).send({ staus: false, message: "Invalid request. Please provide Details in body and update" })
        if(!data){
            return res.status(400).send({ status: false, message: "plz provide bookid in params" })
        }
        if(!data1){
            return res.status(400).send({ status: false, message: "plz provide reviewid in params" })
        }
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "Invalid book id" })
        }

        if (mongoose.Types.ObjectId.isValid(data1) == false) {
            return res.status(400).send({ status: false, message: "Invalid review id" })
        }

        const { review, rating, reviewedBy } = updateData
        let book1 = await booksModel.findOne({ _id: data }, { isDeleted: false });
        if (!book1) return res.status(404).send({ status: false, message: 'Book Not Found' })

        let book = await reviewModel.findOneAndUpdate({ _id: data1 ,bookId:data,  isDeleted: false  }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true });
        if (!book) return res.status(404).send({ status: false, message: 'Book Not Found' })

        return res.status(200).send({ status: true, message: 'Success', data: book });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// delete Review
const deleteReviewById = async function (req, res) {
    try {
        let data = req.params.bookId;
        let data1 = req.params.reviewId
        if(!data){
            return res.status(400).send({ status: false, message: "plz provide bookid in params" })
        }
        if(!data1){
            return res.status(400).send({ status: false, message: "plz provide reviewid in params" })
        }
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "Invalid book id" })
        }
        if (mongoose.Types.ObjectId.isValid(data1) == false) {
            return res.status(400).send({ status: false, message: "Invalid review id" })
        }
        let book1 = await booksModel.findByIdAndUpdate({ _id: data , isDeleted: false },{ $inc:{reviews:-1}}, { new: true });
        if (!book1) return res.status(404).send({ status: false, message: 'Book Not Found or already deleted' })

        let book = await reviewModel.findOneAndUpdate({ _id: data1 , bookId: data,  isDeleted: false }, { isDeleted: true,deletedAt: new Date().toLocaleString() }, { new: true });
        if (!book) return res.status(404).send({ status: false, message: 'Review Not Found or already deleted' })
        return res.status(200).send({ status: true, message: 'Success', data: book });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createReview, updateReviewById, deleteReviewById }

  // const review = req.body
        // let arr = Object.keys(review)
        // if (arr.length == 0) return res.status(400).send({ staus: false, message: "Invalid request. Please provide Details" })
        // let data = req.params.bookId;
        // let book = await booksModel.findOne( { _id: data , isDeleted: false });
        // if (!book) return res.status(404).send({ status: false, message: 'Book Not Found' })

        // let dataCreated = await reviewModel.create(review)
        // // book._doc["reviewdata"]=[dataCreated]
        // let reviewData = await booksModel.findOneAndUpdate({ _id: data , isDeleted: false  },{},{new:true})
        // res.status(201).send({status:true, message: 'Success',data: dataCreated });
