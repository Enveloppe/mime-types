import { MimeEntry } from "mime-db";

import MimeEntries from "../src";

const database = new MimeEntries([
	{
		"text/x-python" : {
			"extensions": ["py"],
			"compressible": true
		}
	}
]);

describe("list all RTF", () => {
	it("list all rtf entry by extension", () => {
		const rtf = database.getMimeEntriesByExt("rtf");
		const expected = new Set() as Set<MimeEntry>;
		expected.add({source: "iana", extensions: ["rtf"], compressible: true});
		expected.add({source: "iana", extensions: ["rtf"], compressible: true});
		expect(rtf).toEqual(expected);
	});
	it("list all types by extension", () => {
		const rtf = database.getTypesByExtension("rtf");
		const expected = new Set<string>();
		expected.add("application/rtf");
		expected.add("text/rtf");
		expect(rtf).toEqual(expected);
	});
	it("get extension of types", () => {
		const rtf = database.getAllExtensions("application/rtf");
		const expected = new Set<string>();
		expected.add("rtf");
		expect(rtf).toEqual(expected);
	});
	it("get Mime entry", () => {
		const rtf = database.getMimeEntry("application/rtf");
		const expected = {source: "iana", extensions: ["rtf"], compressible: true};
		expect(rtf).toEqual(expected);
	});
});