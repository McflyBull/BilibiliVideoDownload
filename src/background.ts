'use strict'

import { app, protocol, BrowserWindow, ipcMain, shell, dialog, Menu, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import fs from 'fs-extra'
import { settingData } from './assets/data/default'
import { TaskData, SettingData } from './type'
import downloadVideo from './core/download'
const Store = require('electron-store')
const got = require('got')
const log = require('electron-log')

const store = new Store({
  name: 'database'
})
const isDevelopment = process.env.NODE_ENV !== 'production'
let win: BrowserWindow

// Set software system menu
const template: any = [
  {
    label: app.name,
    submenu: [
      { label: 'About', role: 'about' },
      { label: 'Minimize', role: 'minimize' },
      { label: 'Quit', role: 'quit' }
    ]
  },
  {
    label: 'Actions',
    submenu: [
      { label: 'Select All', role: 'selectAll' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' }
    ]
  }
]
const appMenu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(appMenu)

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Open browser
ipcMain.on('open-browser', (event, url) => {
  shell.openExternal(url)
})

// Open local file
ipcMain.on('open-path', (event, path) => {
  shell.openPath(path)
})

// Open file dialog
ipcMain.handle('open-dir-dialog', () => {
  const filePaths = dialog.showOpenDialogSync({
    title: 'Select download location',
    defaultPath: app.getPath('downloads'),
    properties: ['openDirectory']
  })
  if (filePaths) {
    return Promise.resolve(filePaths[0])
  } else {
    return Promise.reject('not select')
  }
})

// Open folder
ipcMain.on('open-dir', (event, list) => {
  const fileDirs: string[] = []
  list.forEach((id: string) => {
    const task = store.get(`taskList.${id}`)
    if (task && task.fileDir) fileDirs.push(task.fileDir)
  })
  fileDirs.forEach(dir => {
    shell.openPath(dir)
  })
})

// Send http request
ipcMain.handle('got', (event, url, option) => {
  return new Promise((resolve, reject) => {
    got(url, option)
      .then((res: any) => {
        return resolve({ body: res.body, redirectUrls: res.redirectUrls, headers: res.headers })
      })
      .catch((error: any) => {
        log.error(`http error: ${error.message}`)
        return reject(error.message)
      })
  })
})

// Send http request, get buffer
ipcMain.handle('got-buffer', (event, url, option) => {
  return new Promise((resolve, reject) => {
    got(url, option)
      .buffer()
      .then((res: any) => {
        return resolve(res)
      })
      .catch((error: any) => {
        log.error(`http error: ${error.message}`)
        return reject(error.message)
      })
  })
})

// electron-store operations
ipcMain.handle('get-store', (event, path) => {
  return Promise.resolve(store.get(path))
})

ipcMain.on('set-store', (event, path, data) => {
  store.set(path, data)
})

ipcMain.on('delete-store', (event, path) => {
  store.delete(path)
})

// Create context menu
ipcMain.handle('show-context-menu', (event, type: string) => {
  return new Promise((resolve, reject) => {
    const menuMap = {
      download: [
        {
          label: 'Delete task',
          type: 'normal',
          click: () => resolve('delete')
        },
        {
          label: 'Redownload',
          type: 'normal',
          click: () => resolve('reload')
        },
        {
          label: 'Open folder',
          type: 'normal',
          click: () => resolve('open')
        },
        {
          label: 'Select all',
          type: 'normal',
          click: () => resolve('selectAll')
        },
        {
          label: 'Play video',
          type: 'normal',
          click: () => resolve('play')
        }
      ],
      home: [
        { label: 'Select all', role: 'selectAll' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' }
      ]
    }
    const template: any = menuMap[type]
    const contextMenu = Menu.buildFromTemplate(template)
    contextMenu.popup({ window: win })
  })
})

// Open delete task dialog
ipcMain.handle('open-delete-video-dialog', (event, taskCount) => {
  return new Promise((resolve, reject) => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Prompt',
      message: `${taskCount} tasks selected, are you sure you want to delete?`,
      checkboxLabel: 'Also delete files',
      buttons: ['Cancel', 'Delete']
    })
      .then(res => {
        return resolve(res)
      })
      .catch(error => {
        return reject(error)
      })
  })
})

// Delete task files
ipcMain.handle('delete-videos', (event, filePaths) => {
  for (const key in filePaths) {
    fs.removeSync(filePaths[key])
  }
  return Promise.resolve('success')
})

// Download task
ipcMain.on('download-video', (event, task: TaskData) => {
  const setting: SettingData = store.get('setting')
  downloadVideo(task, event, setting)
})

// Get video size
ipcMain.handle('get-video-size', (event, id: string) => {
  const task = store.get(`taskList.${id}`)
  if (task && task.filePathList) {
    try {
      const stat = fs.statSync(task.filePathList[0])
      return Promise.resolve(stat.size)
    } catch (error: any) {
      log.error(`get-video-size error: ${error.message}`)
    }
    try {
      const stat1 = fs.statSync(task.filePathList[2])
      const stat2 = fs.statSync(task.filePathList[3])
      return Promise.resolve(stat1.size + stat2.size)
    } catch (error) {
      return Promise.resolve(0)
    }
  }
})

// Close app
ipcMain.on('close-app', () => {
  handleCloseApp()
})

// Minimize app
ipcMain.on('minimize-app', () => {
  if (!win.isMinimized()) win.minimize()
})

// Open delete task dialog
ipcMain.handle('open-reload-video-dialog', (event, taskCount) => {
  return new Promise((resolve, reject) => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Prompt',
      message: `${taskCount} tasks selected, are you sure you want to redownload?`,
      buttons: ['Cancel', 'Redownload']
    })
      .then(res => {
        return resolve(res)
      })
      .catch(error => {
        return reject(error)
      })
  })
})

// Save danmuku file
ipcMain.on('save-danmuku-file', (event, content, path) => {
  fs.writeFile(path, content, { encoding: 'utf8' })
})

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools({ mode: 'detach' })
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

function initStore () {
  const setting = store.get('setting')
  const taskList = store.get('taskList')
  if (!setting) {
    store.set('setting', {
      ...settingData,
      downloadPath: app.getPath('downloads')
    })
  } else {
    store.set('setting', {
      ...settingData,
      ...store.get('setting')
    })
  }
  if (!taskList) {
    store.set('taskList', {})
  }
  // Store store
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('init-store', {
      setting: store.get('setting'),
      taskList: store.get('taskList')
    })
  })
}

function handleCloseApp () {
  // Check if there are any downloading tasks
  const taskList = store.get('taskList')
  let count = 0
  for (const key in taskList) {
    const task = taskList[key]
    if (task.status !== 0 && task.status !== 5) {
      count += 1
      task.status = 5
      task.progress = 100
    }
  }
  dialog.showMessageBox(win, {
    type: 'info',
    title: 'Prompt',
    message: count ? `There are ${count} tasks downloading, closing the software may cause the tasks to fail to download. Do you want to continue closing the software?` : 'Do you want to close the application?',
    buttons: ['Cancel', 'Close']
  })
    .then(res => {
      console.log(res);
      if (count) store.set('taskList', taskList)
      if (res.response === 1) win.destroy()
    })
    .catch(error => {
      console.log(error)
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // Create render process
  createWindow()
  // Initialize store
  initStore()
  // Listen for win close
  win.on('close', event => {
    console.log('on win close')
    event.preventDefault()
    handleCloseApp()
  })
  // Add shortcuts
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    const focusWin = BrowserWindow.getFocusedWindow()
    if (focusWin && focusWin.webContents.isDevToolsOpened()) {
      focusWin.webContents.closeDevTools()
    } else if (focusWin && !focusWin.webContents.isDevToolsOpened()) {
      focusWin.webContents.openDevTools({ mode: 'detach' })
    }
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
