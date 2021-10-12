const mongoose = require('mongoose');

const Post = mongoose.model('Post');

const getPost = (request, response) => {
    Post.find({}).then((post) => {
        const data = [];
        for (let i = 0; i < post.length; i++) {
            const obj = {
                id: post[i].id,
                title: post[i].title,
                slug: post[i].slug,
                content: post[i].content,
                thumbnail: post[i].thumbnail
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get post data',
            data
        });
    });
};

const getPostDetail = (request, response) => {
    const { slug } = request.params;
    Post.findOne({
        slug
    }).then((post) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get post data',
            data: {
                id: post.id,
                title: post.title,
                slug: post.slug,
                content: post.content,
                thumbnail: post.thumbnail
            }
        });
    });
};

const PostController = {
    getPost,
    getPostDetail
};

module.exports = PostController;
