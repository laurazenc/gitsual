import lowDb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { DB_PATH } from '../utils/db'

export interface Project {
    name: string
    path: string
}

class ProjectManager {
    db: lowDb.LowdbSync<any>

    constructor() {
        const adapter = new FileSync(DB_PATH)
        this.db = lowDb(adapter)
    }

    public async initDatabase() {
        await this.db.read()
        return this
    }

    public getProjectsDb() {
        return this.db.get('projects')
    }

    public getProjects() {
        return this.db.get('projects').value()
    }
    public getProject(name: string) {
        return (
            this.db
                .get('projects')
                // @ts-ignore
                .find({ name })
                .value()
        )
    }
}

export default ProjectManager
