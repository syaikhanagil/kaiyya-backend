const mongoose = require('mongoose');

const Size = mongoose.model('Size');
const Product = mongoose.model('Product');

exports.createSize = (request, response) => {
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
            product.stock += stock;
            product.sizes = [...product.sizes, size.id];
            product.save();
            return response.status(200).json({
                status: true,
                message: 'new size created successfully',
                data: size
            });
        });
    });
};

exports.editSize = (request, response) => {
    const { productId, name, price, stock, length, width } = request.body;
    const newSize = new Size({
        name,
        price,
        stock,
        length,
        width
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
            product.stock += stock;
            product.sizes = [...product.sizes, size.id];
            product.save();
            return response.status(200).json({
                status: true,
                message: 'new size created successfully',
                data: size
            });
        });
    });
};
