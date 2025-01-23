import createProductModel from "../model/productModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import ErrorHandler from "../utils/errorhandler.js";
import mongoose from "mongoose";
// Create Product -- Admin
export const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user._id;

    const product = await createProductModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      result: product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}


// Get All Product

export const getAllProduct = async (req, res, next) => {
  try {
    const resultPerPage = 6;
    const productCount = await createProductModel.countDocuments();
    const apiFeatures = new ApiFeatures(createProductModel.find(), req.query).search().filter().pagination(resultPerPage);

    const products = await apiFeatures.query;
    if (products == "") {
      return res.status(200).json({
        success: true,
        message: "Product List is empty"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: 'Product read Successfully',
        data: products,

      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



// update product -- Admin

export let updateProduct = async (req, res, next) => {
  try {
    let product = await createProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      })
    }
    product = await createProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      userFindAndModify: false
    });

    res.status(200).json({
      success: true,
      message: "Produc Updated Successfully",
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


// Delete Product -- Admin

export const deleteProduct = async (req, res, next) => {
  try {
    let product = await createProductModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404))
    }

    product = await createProductModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


// Get Product Details

// export const getProductDetails = async (req, res, next) => {
//   try {
//     let product = await createProductModel.findById(req.params.id);
//     if (!product) {
//       return next(new ErrorHandler("Product not found",404))
//     }

//     res.status(200).json({
//       success: true,
//       message: "Specific Product Read Successfully",
//       data: product,
//     })
//   } catch (error) {
//     console.error("Error fetching product:", error.message);
//   }
// }
export const getProductDetails = async (req, res, next) => {
  try {
    // Validate the ID before querying the database
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorHandler("Invalid product ID", 400));
    }

    const product = await createProductModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Specific Product Read Successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};

// create new review and update the review

export let createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    const product = await createProductModel.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
      product.reviews.forEach(rev => {
        if (rev.user.toString() === req.user._id.toString())
          rev.rating = rating,
            rev.comment = comment
      })
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length
    }

    let avg = 0;
    let ss = product.reviews.forEach((rev) => {
      avg += rev.rating
    })
    // console.log(ss)

    product.ratings = avg / product.reviews.length;
    // console.log(product.ratings);

    await product.save({
      validateBeforeSave: false
    });
    res.status(200).json({
      success: true,
      product
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export let getproductReviews = async (req, res, next) => {
  try {
    const product = await createProductModel.findById(req.query.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    })
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
}

export let deleteReviews = async (req, res, next) => {
  try {
    const productId = req.query.productId;
    const reviewId = req.query.id;

    // Validate input
    if (!productId || !reviewId) {
      return next(new ErrorHandler("Product ID and Review ID are required", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new ErrorHandler("Invalid Product ID format", 400));
    }

    const product = await createProductModel.findById(productId);
    console.log(product);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId.toString()
    );

    // Recalculate ratings
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    const ratings = reviews.length ? avg / reviews.length : 0;
    const numOfReviews = reviews.length;

    // Update the product
    await createProductModel.findByIdAndDelete(
      productId
      // {
      //   reviews,
      //   ratings,
      //   numOfReviews,
      // },
      // {
      //   new: true,
      //   runValidators: true,
      //   useFindAndModify: false,
      // }
    );

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

