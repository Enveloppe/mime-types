import database, { MimeEntry } from "mime-db";


//use a class
export default class MimeEntries {
	private database: { [type: string]: MimeEntry };
	constructor(customTypes: { [type: string]: MimeEntry }[]=[]) {
		this.database = Object.assign(database, ...customTypes);
	}

	private pathToExtension(path: string): string {
		//get the extension from the path
		const ext = path.split(".").pop();
		if (ext) {
			return ext;
		}
		throw new Error("Invalid path");
	}

	/**
	 * Get the types of a given extension
	 * @param extension {string} the extension to get the types of
	 * @returns {Set<string>}
	 */
	public getTypes(extension: string): Set<string> {
		const allTypes = new Set<string>();
		const ext = this.pathToExtension(extension);
		for (const [types, entries] of Object.entries(this.database)) {
			if (entries?.extensions?.includes(ext)) {
				allTypes.add(types);
			}
		}
		return allTypes;
	}

	/**
	 * Get the extension based on the type
	 * @param type {string} the type to get the extensions of
	 * @returns {Set<string>}
	 */
	public getExtensions(type: string): Set<string> {
		const allExtensions = new Set<string>();
		for (const [types, entries] of Object.entries(this.database)) {
			if (types === type && entries.extensions) {
				for (const extension of entries.extensions) {
					allExtensions.add(extension);
				}
			}
		}
		return allExtensions;
	}

	/**
	 * Get the mime entry based on the type
	 * @param type {string} the type to get the entry of
	 * @returns {MimeEntry}
	 */
	getMimeEntry(type: string): MimeEntry {
		return this.database[type];
	}

	/**
	 * Get the mime entry based on the extension
	 * Return all mime entry if the extension is used by multiple types
	 * @param ext {string} the extension to get the entry of
	 * @returns {Set<MimeEntry>}
	 */
	getMimeEntryByExt(ext: string): Set<MimeEntry> {
		const allTypes = this.getTypes(ext);
		const allEntries = new Set() as Set<MimeEntry>;
		for (const type of allTypes) {
			allEntries.add(this.database[type]);
		}
		//remove duplicates
		return allEntries;
	}
}
