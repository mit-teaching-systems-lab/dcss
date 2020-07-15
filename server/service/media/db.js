const { sql } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.addAudioTranscript = async ({ key, response, transcript }) => {
  return await withClientTransaction(async client => {
    // eslint-disable-next-line no-console
    console.log(transcript);
    await client.query(sql`
      INSERT INTO audio_transcript (key, response, transcript)
      VALUES (${key}, ${response}, ${transcript});
    `);
  });
};

exports.addImage = async ({ name, size, url, user_id }) => {
  return await withClientTransaction(async client => {
    const insert = await client.query(sql`
      INSERT INTO image (name, size, url, user_id)
      VALUES (${name}, ${size}, ${url}, ${user_id})
      RETURNING *;
    `);
    return insert.rows[0];
  });
};

exports.addImageRecognition = async ({ id, classes }) => {
  return await withClientTransaction(async client => {
    const insert = await client.query(sql`
      INSERT INTO image_recognition (image_id, classes)
      VALUES (${id}, ${classes})
      RETURNING *;
    `);
    return insert.rows[0];
  });
};

exports.getImagesByUserId = async user_id => {
  return await withClient(async client => {
    // This MUST allow image records that do not have
    // image_recognition records to be included in
    // the result set.
    const result = await client.query(sql`
      SELECT
        image.id AS id,
        name,
        url,
        classes,
        user_id,
        image.created_at AS created_at
      FROM image
      LEFT JOIN image_recognition
      ON image_recognition.image_id = image.id
      WHERE user_id = ${user_id}
      AND image.deleted_at IS NULL;
    `);

    return result.rows;
  });
};
