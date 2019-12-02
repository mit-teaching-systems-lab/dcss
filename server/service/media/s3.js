const AWS = require('aws-sdk');
const S3Proxy = require('s3-proxy');
const util = require('util');
require('dotenv').config();

const s3 = new AWS.S3();
const s3Params = {
    Bucket: process.env.S3_BUCKET
};

exports.uploadToS3 = async function(key, buffer) {
    let Key = key;
    if (process.env.ENV) {
        Key = `${process.env.ENV}/${key}`;
    }
    let params = {
        ...s3Params,
        Body: Buffer.from(buffer),
        Key
    };
    await util.promisify(s3.putObject).call(s3, params);

    // Intentionally return the UNPREFIXED key.
    return key;
};

exports.requestFromS3 = S3Proxy({
    bucket: process.env.S3_BUCKET,
    prefix: process.env.ENV,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    overrideCacheControl: 'max-age=2592000'
});
