import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  const values = [CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET];
  if (values.some((v) => !v)) return false;
  // treat placeholder/dummy values as not configured
  if (values.some((v) => typeof v === 'string' && v.toLowerCase().includes('your_'))) return false;
  return true;
};

export const createProduct = async (req, res) => {
  try {
    let images = [];

    if (req.body.images) {
      if (typeof req.body.images === 'string') {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
    }

    const imagesLinks = [];
    const cloudinaryConfigured = isCloudinaryConfigured();

    for (let i = 0; i < images.length; i++) {
      const currentImage = images[i];

      if (typeof currentImage === 'string') {
        // This is a new base64 image string
        if (cloudinaryConfigured) {
          try {
            const result = await cloudinary.uploader.upload(currentImage, {
              folder: 'shophub/products'
            });
            imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url
            });
          } catch (cloudinaryError) {
            // If Cloudinary fails, use base64 directly or placeholder
            imagesLinks.push({
              public_id: `product_${Date.now()}_${i}`,
              url: currentImage.startsWith('data:image') ? currentImage : `https://via.placeholder.com/400?text=Product+Image`
            });
          }
        } else {
          // Cloudinary not configured, use base64 image directly or placeholder
          imagesLinks.push({
            public_id: `product_${Date.now()}_${i}`,
            url: currentImage.startsWith('data:image') ? currentImage : `https://via.placeholder.com/400?text=Product+Image`
          });
        }
      } else if (typeof currentImage === 'object' && currentImage.url) {
        // This is an existing image object from the frontend
        imagesLinks.push({
          public_id: currentImage.public_id || `product_${Date.now()}_${i}`,
          url: currentImage.url
        });
      }
    }

    // If no images provided, add a placeholder
    if (imagesLinks.length === 0) {
      imagesLinks.push({
        public_id: `product_${Date.now()}_placeholder`,
        url: 'https://via.placeholder.com/400?text=No+Image'
      });
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query).limit(Number(limit)).skip(skip).sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({ success: true, products, totalProducts, currentPage: Number(page), totalPages: Math.ceil(totalProducts / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.images) {
      const cloudinaryConfigured = isCloudinaryConfigured();

      // Destroy old images only if new images are being uploaded via Cloudinary
      if (cloudinaryConfigured) {
        for (let i = 0; i < product.images.length; i++) {
          try {
            await cloudinary.uploader.destroy(product.images[i].public_id);
          } catch (e) {
            // Ignore if image doesn't exist in Cloudinary
          }
        }
      }

      let newImagesFromReq = [];
      if (typeof req.body.images === 'string') {
        newImagesFromReq.push(req.body.images);
      } else {
        newImagesFromReq = req.body.images;
      }

      const imagesLinks = [];

      for (let i = 0; i < newImagesFromReq.length; i++) {
        const currentImage = newImagesFromReq[i];

        if (typeof currentImage === 'string') {
          // This is a new base64 image string
          if (cloudinaryConfigured) {
            try {
              const result = await cloudinary.uploader.upload(currentImage, { folder: 'shophub/products' });
              imagesLinks.push({ public_id: result.public_id, url: result.secure_url });
            } catch (cloudinaryError) {
              imagesLinks.push({
                public_id: `product_${Date.now()}_${i}`,
                url: currentImage.startsWith('data:image') ? currentImage : `https://via.placeholder.com/400?text=Product+Image`
              });
            }
          } else {
            imagesLinks.push({
              public_id: `product_${Date.now()}_${i}`,
              url: currentImage.startsWith('data:image') ? currentImage : `https://via.placeholder.com/400?text=Product+Image`
            });
          }
        } else if (typeof currentImage === 'object' && currentImage.url) {
          // This is an existing image object from the frontend
          imagesLinks.push({
            public_id: currentImage.public_id || `product_${Date.now()}_${i}`,
            url: currentImage.url
          });
        }
      }
      req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cloudinaryConfigured = isCloudinaryConfigured();

    if (cloudinaryConfigured) {
      for (let i = 0; i < product.images.length; i++) {
        try {
          await cloudinary.uploader.destroy(product.images[i].public_id);
        } catch (e) {
          // Ignore if image doesn't exist in Cloudinary
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = { user: req.user.id, name: req.user.name, rating: Number(rating), comment };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user.id.toString());

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user.id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let totalRating = 0;
    product.reviews.forEach((rev) => { totalRating += rev.rating; });
    product.ratings = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let totalRating = 0;
    reviews.forEach((rev) => { totalRating += rev.rating; });

    const ratings = reviews.length > 0 ? totalRating / reviews.length : 0;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};