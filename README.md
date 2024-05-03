# Mime Entries

`mime-entries` is a utility for handling and converting between MIME types and file extensions. 

It provides a simple interface to fetch MIME types based on file extensions and vice versa. This can be particularly useful in scenarios where you need to determine the MIME type of a file using the name or path, based on their extension.

It uses [mime-db](https://github.com/jshttp/mime-db) as references for MIME types and file extensions.

## Installation

```
npm install mime-entries
```

(You can also use `yarn` or `pnpm` instead of `npm`)

## Usage

```typescript
import { getMimeType, getExtension } from 'mime-entries';

// Create a new instance of MimeEntries
const mimeEntries = new MimeEntries();

// Get MIME types by file extension
const types = mimeEntries.getTypesByExtension('.txt');
console.log(types);

// Get all extensions for a given MIME type
const extensions = mimeEntries.getAllExtensions('text/plain');
console.log(extensions);

// Get MIME entry by type
const entryByType = mimeEntries.getMimeEntry('text/plain');
console.log(entryByType);

// Get MIME entries by extension
const entriesByExt = mimeEntries.getMimeEntriesByExt('.txt');
console.log(entriesByExt);
```

It is also possible to add custom types and extensions to the instance.

```typescript
import { MimeEntries } from 'mime-entries';

// Create a new instance of MimeEntries
const database = new MimeEntries(
	{"text/x-python" : {"extensions": ["py"],"compressible": true}}
);
const entriesByExt = database.getMimeEntriesByExt('.py');
console.log(entriesByExt); // => { 'text/x-python': { extensions: [ 'py' ], compressible: true } }
```

## API

### `getTypesByExtension(extension: string): Set<string> | undefined`
Returns a set of MIME types for a given file extension.

```typescript
database.getTypesByExtension("txt") // => Set { 'text/plain' }
database.getTypesByExtension(".json") // => Set { 'application/json' }
database.getTypesByExtension("js") // => Set { 'application/javascript', 'text/javascript' }
database.getTypesByExtension("dir/text.txt") // => Set { 'text/plain' }
database.getTypesByExtension("dir\\text.txt") // => Set { 'text/plain' }
database.getTypesByExtension(".txt.txt") // => Set { 'text/plain' }
database.getTypesByExtension(".txt") // => Set { 'text/plain' }
```

`undefined` is returned if the extension is not found.

```typescript
database.getTypesByExtension("unknown") // => undefined
```

And an error is thrown if the extension is empty or invalid.

```typescript
database.getTypesByExtension(" ") // => Error: Invalid path
```

### `getAllExtensions(type: string): Set<string> | undefined`
Returns a set of file extensions for a given MIME type.

```typescript
database.getAllExtensions("text/plain") // => { 'txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini' }
database.getAllExtensions("application/json") // => { 'json', 'map' }
```

### `getMimeEntry(type: string): MimeEntry | undefined`

Just an alias of `this.database[type]`.

```typescript
database.getMimeEntry("text/plain") // => { source: 'iana', charset: 'UTF-8', compressible: true, extensions: [ 'txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini' ] }
```

### `getMimeEntriesByExt(extension: string): {[type: string]: MimeEntry} | undefined`

Returns a map of MIME entries for a given file extension.

```typescript
database.getMimeEntriesByExt("txt") // => { 'text/plain': { source: 'iana', charset: 'UTF-8', compressible: true, extensions: [ 'txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini' ] } }
database.getMimeEntriesByExt("js") /*
 => 'application/javascript': {
    source: 'iana',
    charset: 'UTF-8',
    compressible: true,
    extensions: [ 'js', 'mjs' ]
  },
  {
	'text/javascript': { source: 'iana', compressible: true }
  }
*/
```

### `getMainTypeByExt(extension: string): Set<string> | undefined`

Returns a set of main MIME types for a given file extension.
Main is the first part of the MIME type, e.g. `text` in `text/plain`.

```typescript
database.getMainTypeByExt("txt") // => Set { 'text' }
database.getMainTypeByExt("js") // => Set { 'application', 'text' }
```

## Credit & Thanks

I was heavily inspired by [mime](https://github.com/broofa/mime) but wanted to add some function. I ended up to write my own version, hopefully more understandable and with more features than mime.

## Contributing

The package use [commit-and-tag-version](https://www.npmjs.com/package/commit-and-tag-version) for release, so please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

Don't forget to update the tests before submitting a PR!