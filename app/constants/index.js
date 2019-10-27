import fs from 'fs';

import path from 'path';

/* eslint-disable no-empty */
try {
  fs.mkdirSync(path.resolve(__dirname, `../.gitsual`));
} catch (ignore) {}
/* eslint-disable no-empty */

export const DB_PATH = path.resolve(__dirname, `../.gitsual/db.json`); // eslint-disable-line
