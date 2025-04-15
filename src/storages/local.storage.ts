import fs from 'fs'
import { Service } from 'typedi'

@Service()
export class LocalStorage {
    static TEMP_DIR = [__dirname, 'tmp'].join('/')

    static getTempDir() {
        if (!fs.existsSync(this.TEMP_DIR)) {
            fs.mkdirSync(this.TEMP_DIR)
        }

        return this.TEMP_DIR
    }
}
