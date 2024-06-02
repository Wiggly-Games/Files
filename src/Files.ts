import * as fs from "fs";
import * as Path from "path";

const fsPromises = fs.promises;

const pathToMain = require.main.path;

// Export a variable referring to the root path of the file being run.
// Note: We're using process.cwd() for now, which isn't the best solution.
// For our purposes, it's probably fine, but may be worth looking into something better later.
export const ROOT = process.cwd();

// Creates a new folder on the file system.
export async function CreateDirectory(path: string){
    try {
        await fsPromises.mkdir(path);
    } catch (exception) {
        // If it already exists, do nothing
        if (exception.code == 'EEXIST') {

        } else {
            // not an eexist exception, re-throw the error
            throw exception;
        }
    }
}

// Returns a list of all file names within the parent directory.
export async function GetDescendants(path: string, filter: (file: string)=>boolean): Promise<string[]> {
    const paths: string[] = [path];
    let current = 0;

    const results: string[] = [ ];
    while (current < paths.length) {
        // Get the current path to look at
        const currentPath = paths[current];
        current ++;

        // Read the file type
        const fileData = await fsPromises.stat(currentPath);

        // If it passes our filter, add the file to the list of results
        if (filter(currentPath)) {
            results.push(currentPath);
        }

        // If it's a directory, recurse down the children of the directory
        if (fileData.isDirectory()) {
            const children = await fsPromises.readdir(currentPath);
            paths.push(...children.map(x => Path.join(currentPath, x)));
        }
    }

    return results;
}

// Returns the absolute path to a file given its relative path from the ROOT folder.
export async function GetAbsolutePath(relativePathFromRoot: string) {
    return Path.join(ROOT, relativePathFromRoot);
}

// Reads all files located under a directory, non-recursively.
export async function ReadDirectoryFiles(path: string): Promise<string[]> {
    return await fsPromises.readdir(path);
}

// Append, adding to the end of a file.
export async function Append(filePath : string, text : string) {
    await fsPromises.appendFile(filePath, `${text}\n`);
}

// Save to a file, deleting the existing contents of the file.
export async function Overwrite(filePath: string, data: string) {
    await fsPromises.writeFile(filePath, data);
}

// Read from a file, returning the contents as plain text.
export async function ReadFile(filePath: string): Promise<string> {
    const contents = await fsPromises.readFile(filePath);
    return contents.toString();
}

// Load JSON data from a file, optionally including a function to be used for parsing records.
export async function LoadJson(filePath: string, parser?: (this: any, key: string, value: any) => any) {
    let data: string;
    try {
        data = await ReadFile(filePath);
    } catch (e) {
        if (e.code === 'ENOENT') {
            // If the error code is 'file doesn't exist', return undefined
            return undefined;
        }

        // Otherwise, re-throw the error
        throw e;
    }

    return JSON.parse(data, parser);
}