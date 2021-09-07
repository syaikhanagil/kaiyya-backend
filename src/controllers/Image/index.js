const mongoose = require('mongoose');
// const multer = require('multer');
const Image = mongoose.model('Image');
const Product = mongoose.model('Product');
const upload = require('../../configs/Multer');
// const CONSTANT = require('../../constant');

const uploadImage = async (request, response) => {
    const { productId } = request.body;
    await Product.findOne({
        _id: productId
    }).then(async (product) => {
        await upload(request, response, 'product').then((url) => {
            const newImage = new Image({
                product: product.id,
                src: url
            });
            newImage.save((err, image) => {
                if (err) {
                    return response.status(400).json({
                        status: false,
                        message: 'image upload success, but can\'t save in database'
                    });
                }
                product.images = [...product.images, image.id];
                product.save();
                return response.status(200).json({
                    status: true,
                    message: 'image successfully uploaded',
                    data: image
                });
            });
        }).catch(() => {
            return response.status(400).json({
                status: false,
                message: 'image upload failed'
            });
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'product not found'
        });
    });
};

const getImage = async (request, response) => {
    const { imageId } = request.params;
    Image.find({
        _id: imageId
    }).then((images) => {
        const data = [];
        for (let i = 0; i < images.length; i++) {
            const obj = {
                id: images[i].id,
                src: images[i].src
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            data
        });
    });
};

const getImages = async (request, response) => {
    const { productId } = request.params;
    await Image.find({
        product: productId
    }).then((images) => {
        const data = [];
        for (let i = 0; i < images.length; i++) {
            const obj = {
                id: images[i].id,
                src: images[i].src
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            data
        });
    });
};

// Delete one Image
const deleteImage = async (request, response) => {
    const { id } = request.params;
    Image.findOne({
        id
    }).then((image) => {
        image.delete();
        return response.status(200).json({
            status: true,
            message: 'image successfully deleted'
        });
    });
};

// Delete Image Collection
const deleteCollection = async (request, response) => {
    const { productId } = request.params;
    Image.findOne({
        product: productId
    }).then((image) => {
        image.delete();
        return response.status(200).json({
            status: true,
            message: 'image successfully deleted'
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'image successfully deleted'
        });
    });
};
const ImageController = {
    uploadImage,
    getImage,
    getImages,
    deleteImage,
    deleteCollection
};

module.exports = ImageController;
