const AWS = require('aws-sdk');
require('dotenv').config();

const rekognition = new AWS.Rekognition({
  bucket: process.env.S3_BUCKET,
  prefix: process.env.ENV,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2'
});

exports.requestRecognitionAsync = async buffer => {
  let classes;

  try {
    const { Labels } = await new Promise((resolve, reject) => {
      rekognition.detectLabels(
        {
          Image: {
            Bytes: buffer
          },
          MaxLabels: 4096,
          MinConfidence: 90
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    });

    classes = Labels.map(label => {
      const mapping = {
        class: label.Name.toLowerCase(),
        score: +(label.Confidence / 100).toFixed(3)
      };

      if (label.Parents.length) {
        const parentage = label.Parents.reverse()
          .map(parent => parent.Name.toLowerCase())
          .join('/');

        mapping.type_hierarchy = `/${parentage}/${label.Name.toLowerCase()}`;
      }

      return mapping;
    });
  } catch (error) {
    console.log(error);
    classes = null;
  }

  return classes;
};
