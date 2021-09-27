const mongoose = require('mongoose');

const Rules = mongoose.model('Rules');

const createRules = (request, response) => {
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

const getRules = (request, response) => {
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

const rulesController = {
    createRules,
    getRules
};

module.exports = rulesController;
