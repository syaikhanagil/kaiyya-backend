const mongoose = require('mongoose');
const { uploadSingle } = require('../../configs/Multer');

const Post = mongoose.model('Post');

exports.createPost = async (request, response) => {
    const { title, content } = request.body;
    const slug = title.split(' ').join('-');
    await uploadSingle(request, response, 'post').then((thumbnail) => {
        const newPost = new Post({
            title,
            thumbnail: {
                name: thumbnail.fileName,
                src: thumbnail.url
            },
            slug,
            content
        });
        newPost.save((err, post) => {
            if (err) {
                return response.status(400).json({
                    status: false,
                    message: 'failed to create new catalog'
                });
            }
            return response.status(200).json({
                status: true,
                message: 'new post created successfully',
                data: post
            });
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'failed to upload catalog banner'
        });
    });
};

exports.editPost = (request, response) => {
    const { postId } = request.params;
    const { title, content } = request.body;
    const slug = title.split(' ').join('-');
    Post.findOne({
        _id: postId
    }).then((post) => {
        post.title = title;
        post.slug = slug;
        post.content = content;
        post.save();
        return response.status(200).json({
            status: 200,
            message: 'new post successfully created',
            data: post
        });
    });
};

exports.getPost = (request, response) => {
    Post.find({}).then((post) => {
        const data = [];
        for (let i = 0; i < post.length; i++) {
            const obj = {
                id: post.id,
                title: post.title,
                slug: post.slug,
                content: post.content,
                thumbnail: post.thumbnail
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: 200,
            message: 'successfully get post data',
            data
        });
    });
};

exports.getPostDetail = (request, response) => {
    const { postId } = request.params;
    Post.findOne({
        _id: postId
    }).then((post) => {
        return response.status(200).json({
            status: 200,
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

exports.deletePost = (request, response) => {
    const { postId } = request.params;
    Post.deleteOne({
        _id: postId
    }).then((post) => {
        return response.status(200).json({
            status: true,
            data: post
        });
    });
};
