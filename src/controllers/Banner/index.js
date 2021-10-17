const mongoose = require('mongoose');

const Banner = mongoose.model('Banner');

const getBanner = async (request, response) => {
    await Banner.find({
        is_active: true
    })
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

const BannerController = {
    getBanner
};

module.exports = BannerController;
