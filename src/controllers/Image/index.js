const mongoose = require('mongoose');
// const multer = require('multer');
const Image = mongoose.model('Image');
// const CONSTANT = require('../../constant');

const getImage = async (request, response) => {
    const { imageId } = request.params;
    Image.find({
        _id: imageId
    }).then((images) => {
        const data = [];
        for (let i = 0; i < images.length; i++) {
            const obj = {
                id: images[i].id,
                name: images[i].name,
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
                name: images[i].name,
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

const ImageController = {
    getImage,
    getImages
};

module.exports = ImageController;
