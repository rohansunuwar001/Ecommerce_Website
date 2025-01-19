import createProductModel from "../model/productModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
// Create Product -- Admin
export const createProduct = async (req, res, next) => {
  try {
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
    const apiFeatures = new ApiFeatures(createProductModel.find(),req.query).search().filter().pagination(resultPerPage);
  
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
        data:products,
       
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
      return res.status(500).json({
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
      return res.status(500).json({
        success: false,
        message: "Product Not Found"
      })
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

export const getProductDetails = async (req, res, next) => {
  try {
    let product = await createProductModel.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product Not Found",
        productCount
      })
    }

    res.status(200).json({
      success: true,
      message: "Specific Product Read Successfully",
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
