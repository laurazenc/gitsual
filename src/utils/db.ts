import fs from 'fs'
import path from 'path'

try {
    if (!fs.existsSync(path.resolve(`./.gitsual`))) fs.mkdirSync(path.resolve(`./.gitsual`))
} catch (ignore) { } // eslint-disable-line

export const DB_PATH = path.resolve(`./.gitsual/db.json`) // eslint-disable-line