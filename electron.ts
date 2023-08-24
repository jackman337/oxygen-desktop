// electron.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as pathImport from 'path';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { FileDetails } from "./src/types";

require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});

let mainWindow: Electron.BrowserWindow | null;

// Set up the SQLite database
const dbPath = pathImport.resolve(app.getPath('userData'), 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

db.serialize(function() {
  db.run(`
    CREATE TABLE IF NOT EXISTS project_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      path TEXT UNIQUE,
      file_extension TEXT,
      file_created_at TEXT,
      file_last_modified TEXT,
      is_directory INTEGER,
      is_active INTEGER
    );
  `, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('project_files table created.');
  });

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_filename ON project_files(filename);
  `, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Index on filename created.');
  });

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_path ON project_files(path);
  `, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Index on path created.');
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 850,
    minWidth: 1500,  // This is the minimum width the window can be resized to
    minHeight: 850,  // This is the minimum height the window can be resized to
    webPreferences: {
      preload: pathImport.join(__dirname, 'preload.js'),
      contextIsolation: true, // protect against prototype pollution
      nodeIntegration: false, // is an alternative for contextIsolation
    },
  });

  mainWindow.loadURL(
    app.isPackaged
      ? `file://${pathImport.join(__dirname, '../build/index.html')}`
      : 'http://localhost:3000'
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// When receiving a 'installUpdate' event from renderer, quit and install the update
ipcMain.on('installUpdate', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('read-dir', async (event, path) => {
  const files = await fsPromises.readdir(path)
  return files
})

ipcMain.handle('is-directory', async (_, path: string) => {
  const stats = fs.statSync(path);
  return stats.isDirectory();
});

ipcMain.handle('stat', (event, filePath): any => {
  const stats = fs.statSync(filePath);
  const fileExtension = pathImport.extname(filePath);
  // Here you're merging the properties of `stats` into a new object,
  // along with the additional `extension` property.
  return {...stats, extension: fileExtension};
});

interface ProjectFile {
  filename: string;
  path: string;
  is_active: number;
  is_directory: number;
  file_extension: string;
  file_created_at: string;
  file_last_modified: string;
}

// Upsert file details
ipcMain.handle('upsert-file-details', async (event, fileDetails: FileDetails) => {
  const fileMetadata = {
    filename: fileDetails.filename,
    path: fileDetails.path,
    is_active: fileDetails.isActive ? 1 : 0,
    file_extension: fileDetails.extension,
    file_created_at: fileDetails.createdAt,
    file_last_modified: fileDetails.lastModifiedAt,
    is_directory: fileDetails.isDirectory ? 1 : 0,
  };

  db.run(`
    INSERT OR REPLACE INTO project_files (
      filename,
      path,
      file_extension,
      file_created_at,
      file_last_modified,
      is_directory,
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `, [fileMetadata.filename, fileMetadata.path, fileMetadata.file_extension, fileMetadata.file_created_at, fileMetadata.file_last_modified, fileMetadata.is_directory, fileMetadata.is_active], (err) => {
    if (err) {
      throw err;
    }
  });
});

// Delete file
ipcMain.handle('delete-file', async (event, path: string) => {
  db.run(`
    DELETE FROM project_files WHERE path = $path;
  `, { $path: path }, (err) => {
    if (err) {
      throw err;
    }
  });
});

// Get all active FileDetails
ipcMain.handle('get-all-files', async () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM project_files WHERE is_active = 1;
    `, [], (err, rows: ProjectFile[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(file => ({
          filename: file.filename,
          path: file.path,
          isActive: Boolean(file.is_active),
          isDirectory: Boolean(file.is_directory),
          extension: file.file_extension,
          createdAt: file.file_created_at,
          lastModifiedAt: file.file_last_modified,
        })));
      }
    });
  });
});

// Get a specific file metadata by path
ipcMain.handle('get-file-details', async (event, path: string) => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM project_files WHERE path = $path;
    `, { $path: path }, (err, row: ProjectFile) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          filename: row.filename,
          path: row.path,
          isActive: Boolean(row.is_active),
          isDirectory: Boolean(row.is_directory),
          extension: row.file_extension,
          createdAt: row.file_created_at,
          lastModifiedAt: row.file_last_modified,
        });
      }
    });
  });
});

// Read file from file storage
ipcMain.handle('read-file', async (event, fileName: string) => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT path FROM project_files WHERE filename = $filename;
    `, { $filename: fileName }, async (err, row: ProjectFile) => {
      if (err) {
        reject(err);
      } else {
        if (!row || !row.path) {
          reject(new Error(`No path found for file with name: ${fileName}`));
        }

        try {
          const content = await fsPromises.readFile(row.path, 'utf-8');
          resolve(content);
        } catch (err) {
          console.error(`Failed to read file at path: ${row.path}`, err);
          reject(err);
        }
      }
    });
  });
});


app.on('ready', () => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});

// Close the SQLite database when the app is quitting
app.on('before-quit', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
});

ipcMain.handle('get-app-version', (event) => {
  return app.getVersion();
});

// Log both in development and production:
autoUpdater.logger = require("electron-log");
(autoUpdater.logger as any).transports.file.level = "info";

// Enable automatic update download and installation
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// Send auto-updater events to the renderer process
autoUpdater.on('update-available', () => {
  if (mainWindow) {
    mainWindow.webContents.send('update_available');
  }
});

autoUpdater.on('update-downloaded', () => {
  if (mainWindow) {
    mainWindow.webContents.send('update_downloaded');
  }
});
