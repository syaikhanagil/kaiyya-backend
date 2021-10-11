const mongoose = require('mongoose');

const Rules = mongoose.model('Rules');

exports.createRules = (request, response) => {
    const { title, content } = request.body;
    const newRules = new Rules({
        title,
        content
    });
    newRules.save((err, rules) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'failed to create new rules'
            });
        }
        return response.status(200).json({
            status: true,
            message: 'new rules created successfully',
            data: rules
        });
    });
};

exports.getRules = (request, response) => {
    Rules.find().then((rules) => {
        const data = [];
        for (let i = 0; i < rules.length; i++) {
            const obj = {
                id: rules[i].id,
                title: rules[i].title,
                content: rules[i].content
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get rules data',
            data
        });
    });
};

exports.editRules = (request, response) => {
    const { rulesId } = request.params;
    const { title, content } = request.body;
    Rules.findOne({
        _id: rulesId
    }).then((rules) => {
        rules.title = title;
        rules.content = content;
        rules.save();
        return response.status(200).json({
            status: true,
            message: 'new rules created successfully',
            data: rules
        });
    });
};

exports.deleteRules = (request, response) => {
    const { rulesId } = request.params;
    Rules.deleteOne({
        _id: rulesId
    }).then((rules) => {
        return response.status(200).json({
            status: true,
            message: 'successfully delete rules',
            data: rules
        });
    });
};
