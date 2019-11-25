import * as lowDb from 'lowdb'
import * as FileAsync from 'lowdb/adapters/FileAsync'
import { DB_PATH } from '../utils/db'

export interface Project {
	db: lowDb.LowdbAsync<any>
}


class ProjectManager {
	db: lowDb.LowdbAsync<any>

	constructor() {
		this.db = null		
	}

	public async initDatabase() {
		const adapter = new FileAsync(DB_PATH)
		this.db = await lowDb(adapter)
		await this.db.defaults({ projects: [] }).write()			
	}
}

export default ProjectManager