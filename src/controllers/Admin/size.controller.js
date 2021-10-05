const mongoose = require('mongoose');

const Size = mongoose.model('Size');
const Product = mongoose.model('Product');

exports.createSize = (request, response) => {
    const { productId } = request.params;
    const { name, price, stock, length, width } = request.body;
    Product.findOne({
        _id: productId
    }).then((product) => {
        const newSize = new Size({
            product: productId,
            name,
            price,
            stock,
            chart: {
                length,
                width
            }
        });
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
    const { sizeId } = request.params;
    const { productId, name, price, stock, length, width } = request.body;
    Size.findOne({
        _id: sizeId
    }).then((size) => {
        size.name = name;
        size.price = price;
        size.stock = stock;
        size.chart.length = length;
        size.chart.width = width;
        size.save();
        Product.findOne({
            _id: productId
        }).then((product) => {
            Size.find({
                product: productId
            }).then((sizes) => {
                let total = 0;
                let looping = 0;
                for (let i = 0; i < sizes.length; i++) {
                    total += sizes[i].stock;
                    looping += 1;
                    if (looping === sizes.length) {
                        product.stock = total;
                        product.save();
                    }
                }
                return response.status(200).json({
                    status: true,
                    message: 'Size successfully updated'
                });
            });
        });
    });
};
