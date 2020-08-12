const { asyncMiddleware } = require('../../util/api');
const db = require('./db');

async function getLogsAsync(req, res) {
  const {
    begin,
    end,
    offset,
    limit,
    direction
  } = req.params;
  const queryBy = req.url.includes('range/date') ? 'date' : 'count';

  let min, max;

  if (queryBy === 'date') {
    min = begin;
    max = end;
  }

  if (queryBy === 'count') {
    min = Number(offset);
    max = Number(limit);
  }

  // eslint-disable-next-line no-console
  console.log('requesting logs by: ', queryBy, min, max, direction);

  const logs = await db.getLogs(
    queryBy,
    begin || offset,
    end || limit,
    direction
  );

  res.json({ logs, status: 200 });
}

exports.getLogs = asyncMiddleware(getLogsAsync);
