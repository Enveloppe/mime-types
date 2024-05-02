import { MimeEntry } from "mime-db";

import MimeEntries from "../src";

const database = new MimeEntries(
	{
		"text/x-python" : {
			"extensions": ["py"],
			"compressible": true
		}
	}
);

describe("list all RTF", () => {
	it("list all rtf entry by extension", () => {
		const rtf = database.getMimeEntriesByExt("rtf");
		const expected = {
			"application/rtf" : { source: "iana", compressible: true, extensions: [ "rtf" ] },
			"text/rtf" : { source: "iana", compressible: true, extensions: [ "rtf" ] }
		};
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
	it("Get main type", () => {
		const rtf = database.getMainTypeByExt("rtf");
		const expected = new Set<string>();
		expected.add("application");
		expected.add("text");
		expect(rtf).toEqual(expected);
	});
});

describe("test with custom entries", () => {
	it("get custom entry", () => {
		const python = database.getMimeEntry("text/x-python");
		const expected = {extensions: ["py"], compressible: true};
		expect(python).toEqual(expected);
	});
	it("get types by extension", () => {
		const python = database.getTypesByExtension("py");
		const expected = new Set<string>();
		expected.add("text/x-python");
		expect(python).toEqual(expected);
	});
	it("get all extensions", () => {
		const python = database.getAllExtensions("text/x-python");
		const expected = new Set<string>();
		expected.add("py");
		expect(python).toEqual(expected);
	});
	it("get mime entry by extension", () => {
		const python = database.getMimeEntriesByExt("py");
		const expected = {
			"text/x-python" : { compressible: true, extensions: [ "py" ] }
		};
		expect(python).toEqual(expected);
	});
	it("get main type", () => {
		const expected = new Set<string>();
		expected.add("text");
		expect(database.getMainTypeByExt("py")).toEqual(expected);
	});
});

describe("test with a entries with multiple extension", () => {
	it("get mime entry by extension", () => {
		const txt = database.getMimeEntriesByExt("txt");
		const exts = ["txt","text","conf","def","list","log","in","ini"];
		const expected: {[type: string]: MimeEntry} = {
			"text/plain" : { source: "iana", compressible: true, extensions: exts }
		};
		expect(txt).toEqual(expected);
	});
	it("get all extensions", () => {
		const txt = database.getAllExtensions("text/plain");
		const expected = new Set<string>();
		const exts = ["txt","text","conf","def","list","log","in","ini"];
		exts.forEach(ext => expected.add(ext));
		expect(txt).toEqual(expected);
	});
});