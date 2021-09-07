const middleware = (request, response, next) => {
    if (request.session) {
        next();
    } else {
        return response.status(401).json({
            status: false,
            message: 'Unauthorized access, dude.'
        });
    }
};

module.exports = middleware;
