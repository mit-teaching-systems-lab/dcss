const AWS = require('aws-sdk');
const util = require('util');
require('dotenv').config();

const s3 = new AWS.S3();
const s3Params = {
    Bucket: process.env.S3_BUCKET
};

exports.uploadToS3 = async function(key, buffer) {
    if (process.env.ENV) key = `${process.env.ENV}/${key}`;
    let params = { ...s3Params, Key: key };
    params['Body'] = Buffer.from(buffer);
    await util.promisify(s3.putObject).call(s3, params);
    return `s3://${process.env.S3_BUCKET}/${key}`;
};
