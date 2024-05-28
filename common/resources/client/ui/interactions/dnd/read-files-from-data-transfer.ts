import {UploadedFile} from '@common/uploads/uploaded-file';

export async function* readFilesFromDataTransfer(dataTransfer: DataTransfer) {
  const entries: FileSystemEntry[] = [];

  // Pull out all entries before reading them, otherwise
  // some entries will be lost due to recursion with promises
  for (const item of dataTransfer.items) {
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        entries.push(entry);
      }
    }
  }

  for (const entry of entries) {
    if (entry.isFile) {
      if (entry.name === '.DS_Store') continue;
      const file = await getEntryFile(entry as FileSystemFileEntry);
      yield new UploadedFile(file, entry.fullPath);
    } else if (entry.isDirectory) {
      yield* getEntriesFromDirectory(entry as FileSystemDirectoryEntry);
    }
  }
}

async function* getEntriesFromDirectory(
  item: FileSystemDirectoryEntry
): AsyncIterable<any> {
  const reader = item.createReader();

  // We must call readEntries repeatedly because there may be a limit to the
  // number of entries that are returned at once.
  let entries: FileSystemEntry[];
  do {
    entries = await new Promise((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });

    for (const entry of entries) {
      if (entry.isFile) {
        if (entry.name === '.DS_Store') continue;
        const file = await getEntryFile(entry as FileSystemFileEntry);
        yield new UploadedFile(file, entry.fullPath);
      } else if (entry.isDirectory) {
        yield* getEntriesFromDirectory(entry as FileSystemDirectoryEntry);
      }
    }
  } while (entries.length > 0);
}

function getEntryFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}
