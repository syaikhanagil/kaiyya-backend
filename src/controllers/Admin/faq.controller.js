const mongoose = require('mongoose');

const Faq = mongoose.model('Faq');

exports.createFaq = (request, response) => {
    const { title, content } = request.body;
    const newFaq = new Faq({
        title,
        content
    });
    newFaq.save((err, faq) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'failed to create new faq'
            });
        }
        return response.status(200).json({
            status: true,
            message: 'new faq created successfully',
            data: faq
        });
    });
};

exports.getFaq = (request, response) => {
    Faq.find().then((faq) => {
        const data = [];
        for (let i = 0; i < faq.length; i++) {
            const obj = {
                id: faq[i].id,
                title: faq[i].title,
                content: faq[i].content
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get faq data',
            data
        });
    });
};

exports.editFaq = (request, response) => {
    const { faqId } = request.params;
    const { title, content } = request.body;
    Faq.findOne({
        _id: faqId
    }).then((faq) => {
        faq.title = title;
        faq.content = content;
        faq.save();
        return response.status(200).json({
            status: true,
            message: 'new faq created successfully',
            data: faq
        });
    });
};

exports.deleteFaq = (request, response) => {
    const { faqId } = request.params;
    Faq.deleteOne({
        _id: faqId
    }).then((faq) => {
        return response.status(200).json({
            status: true,
            message: 'successfully delete faq',
            data: faq
        });
    });
};
