const mongoose = require('mongoose');
const { uploadSingle } = require('../../configs/Multer');

const Banner = mongoose.model('Banner');

exports.uploadBanner = async (request, response) => {
    const { link } = request.body;
    if (!link) {
        return response.status(400).json({
            status: false,
            message: 'link is required'
        });
    }
    await uploadSingle(request, response, 'banner')
        .then((res) => {
            const newBanner = new Banner({
                name: res.fileName,
                link,
                src: res.url
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
    await Banner.deleteOne({
        _id: id
    })
        .then((banner) => {
            return response.status(200).json({
                status: false,
                message: 'banner successfully deleted',
                data: banner
            });
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
                    link: banner[i].link,
                    is_active: banner[i].is_active ? 'AKTIF' : 'TIDAK AKTIF',
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

exports.bannerActiveStatus = (request, response) => {
    const { bannerId } = request.params;
    const { status } = request.body;
    Banner.findOne({
        _id: bannerId
    })
        .then((banner) => {
            banner.is_active = status;
            banner.save();
            return response.status(200).json({
                status: false,
                message: 'success update banner data',
                data: banner
            });
        })
        .catch((err) => {
            console.log(err);
            return response.status(400).json({
                status: false,
                message: "cant't update banner data"
            });
        });
};
