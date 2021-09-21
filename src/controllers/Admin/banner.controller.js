const mongoose = require('mongoose');
const upload = require('../../configs/Multer');

const Banner = mongoose.model('Banner');

exports.uploadBanner = async (request, response) => {
    const { name, link } = request.body;
    if (!name) {
        return response.status(400).json({
            status: false,
            message: 'name is required'
        });
    }
    if (!link) {
        return response.status(400).json({
            status: false,
            message: 'link is required'
        });
    }
    await upload(request, response, 'banner')
        .then((src) => {
            const newBanner = new Banner({
                name,
                link,
                src
            });
            newBanner.save((err, banner) => {
                if (err) {
                    return response.status(400).json({
                        status: false,
                        message: 'banner upload failed'
                    });
                }
                response.status(200).json({
                    status: true,
                    message: 'banner upload successfully',
                    data: banner
                });
            });
        })
        .catch(() => {
            return response.status(400).json({
                status: false,
                message: 'banner upload failed'
            });
        });
};

exports.deleteBanner = async (request, response) => {
    const { id } = request.params;
    if (!id) {
        return response.status(400).json({
            status: false,
            message: 'id is required'
        });
    }
    await Banner.findOne({
        _id: id
    })
        .then((banner) => {
            banner.delete();
        })
        .catch(() => {
            return response.status(400).json({
                status: false,
                message: 'banner not found in database'
            });
        });
};

exports.getBanner = async (request, response) => {
    await Banner.find({})
        .then((banner) => {
            const data = [];
            for (let i = 0; i < banner.length; i++) {
                const obj = {
                    id: banner[i].id,
                    name: banner[i].name,
                    src: banner[i].src
                };
                data.push(obj);
            }
            return response.status(200).json({
                status: false,
                message: 'success get banner data',
                data
            });
        })
        .catch(() => {
            return response.status(400).json({
                status: false,
                message: "cant't get banner data"
            });
        });
};
