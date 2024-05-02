import database, { MimeEntry } from "mime-db";

/**
 * A class to manage the mime entries database
 * @example
 * ```typescript
 * const database = new MimeEntries(["text/x-python" : {extensions: ["py"], compressible: true}]);
 * ```
 * @see https://github.com/jshttp/mime-db
 */
export default class MimeEntries {
	private database: { [type: string]: MimeEntry };
	/** 
	 * @param {Object.<string, MimeEntry>} customTypes types to add to the database
	 */
	constructor(customTypes: { [type: string]: MimeEntry } = {}) {
		/**
		 * The mime entries database
		 * @type {Object.<string, MimeEntry>}
		 * @private
		 */
		this.database = Object.assign(database, customTypes);
	}
	/**
	 * Convert a path to a extension ; Taking only the last part of the path
	 * @example
	 * ```typescript
	 * const ext = pathToExtension("path/to/file.txt");
	 * console.log(ext); // txt
	 * ```
	 * @param {string} path - the path to convert to an extension
	 * @returns {string} the extension of the file
	 * @throws {Error} if the path is invalid
	 * @private
	 */
	private pathToExtension(path: string): string {
		//get the extension from the path
		const ext = path.split(".").pop();
		if (ext) {
			return ext;
		}
		throw new Error("Invalid path");
	}

	/**
	 * Check if an entry is already in the set
	 * @param {Set<MimeEntry>} entries the set to check in
	 * @param {MimeEntry} entry the entry to check
	 */
	private adds(entries: Set<MimeEntry>, entry: MimeEntry | undefined): Set<MimeEntry> {
		if (!entry) return entries;
		if (!Array.from(entries).some((e) => JSON.stringify(e) === JSON.stringify(entry))) {
			entries.add(entry);
		}
		return entries;
	}

	/**
	 * Get the types of a given extension
	 * @param {string} extension the extension to get the types of
	 * @returns {Set<string>}
	 */
	public getTypesByExtension(extension: string): Set<string> | undefined {
		const allTypes = new Set<string>();
		const ext = this.pathToExtension(extension);
		for (const [types, entries] of Object.entries(this.database)) {
			if (entries?.extensions?.includes(ext)) {
				allTypes.add(types);
			}
		}
		// now check if the types found have some other types
		//for example, both exists: text/javascript and application/javascript
		// and text/javascript have not the extension but application/javascript have
		// then we should return both
		for (const type of Array.from(allTypes)) {
			const secondPartOfType = type.split("/")[1];
			//eg text/javascript => javascript and application/javascript => javascript
			for (const [types] of Object.entries(this.database)) {
				if (types.split("/")[1] === secondPartOfType) {
					allTypes.add(types);
				}
			}
		}
		return allTypes.size > 0 ? allTypes : undefined;
	}



	/**
	 * Get the extension based on the type
	 * @param {string} type the type to get the extensions of
	 * @returns {Set<string>}
	 */
	public getAllExtensions(type: string): Set<string> | undefined{
		const allExtensions = new Set<string>();
		for (const [types, entries] of Object.entries(this.database)) {
			if (types === type && entries.extensions) {
				for (const extension of entries.extensions) {
					allExtensions.add(extension);
				}
			}
		}
		return allExtensions.size > 0 ? allExtensions : undefined;
	}

	/**
	 * Get the mime entry based on the type
	 * @param type {string} the type to get the entry of
	 * @returns {MimeEntry}
	 */
	getMimeEntry(type: string): MimeEntry | undefined {
		return this.database[type];
	}

	/**
	 * Get the mime entry based on the extension
	 * Return all mime entry if the extension is used by multiple types
	 * @param ext {string} the extension to get the entry of
	 * @returns {Object.<string, MimeEntry>}
	 */
	getMimeEntriesByExt(ext: string): {[type: string]: MimeEntry} | undefined{
		const allTypes = this.getTypesByExtension(ext);
		const allEntries: { [type: string]: MimeEntry } = {};
		if (!allTypes) return undefined;
		for (const type of allTypes) {
			allEntries[type] = this.database[type];
		}
		return Object.keys(allEntries).length > 0 ? allEntries : undefined;
	}
}
