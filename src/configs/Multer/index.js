require('dotenv').config();
const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
const fs = require('fs');

const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;

exports.uploadSingle = (request, response, path) => {
    return new Promise((resolve, reject) => {
        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId,
            secretAccessKey,
            region
        });
        const s3 = new aws.S3();
        const params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fs.createReadStream(request.file.path),
            Key: `${path}/${request.file.originalname}`
        };
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            fs.unlinkSync(request.file.path); // Empty temp folder
            const resolveObject = {
                fileName: request.file.originalName,
                url: data.Location
            };
            resolve(resolveObject);
        });
    });
};

exports.uploadMultiple = (request, response, path) => {
    // const files = JSON.parse(request.files);
    return new Promise((resolve, reject) => {
        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId,
            secretAccessKey,
            region
        });
        const s3 = new aws.S3();
        const params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fs.createReadStream(request.files.path),
            Key: (req, file, cb) => {
                const filename = `${path}/${file.originalname}`;
                cb(null, filename);
            }
            // Key: `${path}/${files.originalname}`
        };
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            // fs.unlinkSync(files.path); // Empty temp folder
            const locationUrl = data.Location;
            resolve(locationUrl);
        });
    });
};

// const uploadA = (request, response, path) => {
//     return new Promise((resolve, reject) => {
//         aws.config.setPromisesDependency();
//         aws.config.update({
//             accessKeyId,
//             secretAccessKey,
//             region
//         });
//         const s3 = new aws.S3();
//         const params = {
//             ACL: 'public-read',
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Body: fs.createReadStream(request.files.path),
//             Key: `${path}/${request.file.originalname}`
//         };
//         s3.upload(params, (err, data) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             fs.unlinkSync(request.file.path); // Empty temp folder
//             const locationUrl = data.Location;
//             resolve(locationUrl);
//         });
//     });
// };

// const upload = (bucket) => multer({
//     storage: multerS3({
//         s3,
//         bucket,
//         metadata: (req, file, cb) => {
//             cb(null, { fieldname: file.fieldname });
//         },
//         key: (req, file, cb) => {
//             cb(null, file.filename);
//         }
//     })
// });
