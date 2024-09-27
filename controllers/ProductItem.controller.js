const ProductItem = require('../models/ProductItem');
const Media = require('../models/Media');

// Thêm sản phẩm

const addProduct = async (req, res) => {
    try {
        const { name, description, price, oldPrice, image_id, category, quantity, code, supportPercentage  } = req.body;

        const mediaExits = await Media.findOne({ id: image_id });
        if (!mediaExits) {
            return res.status(404).json({ message: 'Media not found' });
        };

        const newProduct = new ProductItem({
            name,
            description,
            price,
            oldPrice,
            image_id,
            category,
            quantity,
            code,
            supportPercentage
        });
        const savedProduct = await newProduct.save();

        delete savedProduct._doc.image_id;

        const dataSend = {
            ...savedProduct._doc,
            image: {
                id: mediaExits.id,
                url: mediaExits.url
            }
        };

        res.status(201).json({ message: 'Product added successfully', data: dataSend });
    } catch (error) {
        if (error.code === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        res.status(500).json({ message: 'Failed to add product', error });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedProduct = await ProductItem.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

// Lấy sản phẩm theo query
const getProductByQuery = async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        const query = {};

        // If category is provided in the query, add it to the search filter
        if (category) {
            query.category = category;
        }

        // If price range is provided in the query, add it to the search filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = Number(minPrice); // Greater than or equal to minPrice
            }
            if (maxPrice) {
                query.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
            }
        }

        const products = await ProductItem.find(query);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products', error });
    }
};

// Lấy tất cả sản phẩm


const getAllProducts = async (req, res) => {
    try {
        const products = await ProductItem.find({ deleted: false });
        const productDetails = await Promise.all(products.map(async (product) => {
            const productObj = product.toObject();
            productObj.id = productObj._id;
            delete productObj._id;

            const media = await Media.findOne({ id: productObj.image_id });
            if (media) {
                productObj.image = {
                    id: media.id,
                    url: media.url
                };
            } else {
                productObj.image = {
                    id: productObj.image_id,
                    url: null
                };
            }

            delete productObj.image_id;
            return productObj;
        }));
        res.status(200).json({ data: productDetails });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products', error });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductItem.findById({ _id: id});
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get product', error });
    }
}

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await ProductItem.findByIdAndUpdate(id, { deleted: true }, { new: true });

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product marked as deleted', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    getProductByQuery,
    getAllProducts,
    deleteProduct,
    getProductDetail
};
