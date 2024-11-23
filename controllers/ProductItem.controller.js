const ProductItem = require('../models/ProductItem');
const Media = require('../models/Media');

// Thêm sản phẩm

const addProduct = async (req, res) => {
    try {
        const { name, description, price, oldPrice, image_id, category, quantity, code, supportPercentage, keywords } = req.body;

        // Kiểm tra hình ảnh tồn tại
        const mediaExits = await Media.findOne({ id: image_id });
        if (!mediaExits) {
            return res.status(404).json({ message: 'Media not found' });
        }

        // Tạo sản phẩm mới
        const newProduct = new ProductItem({
            name,
            description,
            price,
            oldPrice,
            image_id,
            category,
            quantity,
            code,
            supportPercentage,
            keywords,
        });

        // Lưu sản phẩm
        const savedProduct = await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', data: savedProduct });
    } catch (error) {
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
        const { search, name, category, minPrice, maxPrice, page = 1, limit = 10, sort, inStock } = req.query;
        const query = { deleted: false };
        const skip = (page - 1) * limit;

        // Nếu có từ khóa tìm kiếm
        if (search) {
            query.$text = { $search: search };
        }

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }
        // Nếu có lọc theo category
        if (category) {
            query.category = { $regex: category, $options: "i" };
        }

        // Lọc theo khoảng giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Lọc theo trạng thái còn hàng
        if (inStock) {
            query.quantity = { $gt: 0 }; // Chỉ lấy sản phẩm còn hàng
        }

        // Tùy chọn sắp xếp
        const sortOptions = {};
        if (sort) {
            const [sortField, sortOrder] = sort.split(':');
            sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1; // Sắp xếp giảm hoặc tăng
        }

        console.log("Check Q:",query);
        // Tìm kiếm sản phẩm
        const products = await ProductItem.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        // Đếm tổng số sản phẩm
        const totalProducts = await ProductItem.countDocuments(query);

        const productDetails = await Promise.all(products.map(async (product) => {
            const productObj = product.toObject();
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

        res.status(200).json({
            data: productDetails,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products', error });
    }
};



// Lấy tất cả sản phẩm


const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 15, sort, inStock } = req.query;

        const skip = (page - 1) * limit;

        const query = { deleted: false };
        
        // Lọc theo trạng thái còn hàng
        if (inStock) {
            query.quantity = { $gt: 0 }; // Chỉ lấy sản phẩm còn hàng
        }

        // Tùy chọn sắp xếp
        const sortOptions = {};
        if (sort) {
            const [sortField, sortOrder] = sort.split(':');
            sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1; // Sắp xếp giảm hoặc tăng
        }

        const products = await ProductItem.find(query)
            .sort(sortOptions)
            .skip(skip) 
            .limit(Number(limit)); 

        const totalProducts = await ProductItem.countDocuments(query);

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

        res.status(200).json({
            data: productDetails,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
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
