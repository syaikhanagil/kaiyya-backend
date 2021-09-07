const mongoose = require('mongoose');

const Size = mongoose.model('Size');
const Product = mongoose.model('Product');

const createSize = (request, response) => {
    const { productId, name, price, stock } = request.body;
    const newSize = new Size({
        product: productId,
        name,
        price,
        stock
    });
    Product.findOne({
        _id: productId
    }).then((product) => {
        newSize.save((err, size) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    message: 'create new size failure'
                });
            }
            product.sizes = [...product.sizes, size.id];
            return response.status(200).json({
                status: true,
                message: 'new size created successfully',
                data: size
            });
        });
    });
};

const createSizes = (request, response) => {
    const { product, sizes } = request.body;
    if (!product) {
        return response.status(400).json({
            status: false,
            message: 'product is required'
        });
    }
    if (!sizes) {
        return response.status(400).json({
            status: false,
            message: 'sizes is required'
        });
    }
    if (!Array.isArray(sizes)) {
        return response.status(400).json({
            status: false,
            message: 'sizes should be sent as an array collection'
        });
    }
    for (let i = 0; i < sizes.length; i++) {
        const newSize = new Size({
            product,
            name: sizes[i].name,
            price: sizes[i].price,
            stock: sizes[i].stock
        });
        newSize.save();
    }
    return response.status(200).json({
        status: true,
        message: 'new size collection created successfully'
    });
};

const updateSize = (request, response) => {
    const { sizeId } = request.params;
    const { stock, price } = request.body;

    Size.findOne({
        id: sizeId
    }).then((size) => {
        size.stock = stock;
        size.price = price;
        size.save();
        return response.status(200).json({
            status: true,
            message: 'size successfully updated'
        });
    });
};

const getSizeById = (request, response) => {
    const { sizeId } = request.params;
    Size.findOne({
        id: sizeId
    }).then((size) => {
        return response.status(200).json({
            status: true,
            message: 'get size by id successfully',
            data: size
        });
    });
};

const getSizeByProduct = (request, response) => {
    const { productId } = request.params;
    Size.find({
        _id: productId
    }).then((size) => {
        const data = [];
        for (let i = 0; i < size.length; i++) {
            const obj = {
                name: size[i].name,
                stock: size[i].stock,
                price: size[i].price
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'get size by product success',
            data
        });
    });
};

const deleteSize = (request, response) => {
    const { sizeId } = request.params;
    Size.findOne({
        id: sizeId
    }).then((size) => {
        size.delete();
        return response.status(200).json({
            status: true,
            message: 'size successfully deleted'
        });
    });
};

const SizeController = {
    createSize,
    createSizes,
    getSizeById,
    getSizeByProduct,
    updateSize,
    deleteSize
};

module.exports = SizeController;
