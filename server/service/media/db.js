const { sql } = require('../../util/sqlHelpers');
const { withClientTransaction } = require('../../util/db');

exports.addAudioTranscript = async ({ key, response, transcript }) => {
    return await withClientTransaction(async client => {
        await client.query(sql`
            INSERT INTO audio_transcript (key, response, transcript)
            VALUES (${key}, ${response}, ${transcript});
        `);
    });
};
