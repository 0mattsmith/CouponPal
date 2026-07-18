const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;
let window = null;

const createTray = () => {
  // Using a default icon. In a real app, replace with a proper icon file.
  tray = new Tray(path.join(__dirname, 'icon.png'));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => toggleWindow() },
    { label: 'Quit', click: () => {
      app.isQuiting = true;
      app.quit();
    }}
  ]);

  tray.setToolTip('Coupon Finder');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    toggleWindow();
  });
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Position window centered horizontally below the tray icon (Windows style)
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  // Position above the tray on Windows taskbar if it's at the bottom
  const y = Math.round(trayBounds.y - windowBounds.height - 10);

  return { x, y };
};

const createWindow = () => {
  window = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load dev server or built app
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  window.loadURL(startUrl);

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.show();
    window.focus();
  }
};

app.whenReady().then(() => {
  // We need a dummy icon to prevent crash if icon.png doesn't exist
  // creating an empty 1x1 png file
  const fs = require('fs');
  const iconPath = path.join(__dirname, 'icon.png');
  if (!fs.existsSync(iconPath)) {
    const emptyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    if (!fs.existsSync(path.join(__dirname))) fs.mkdirSync(path.join(__dirname));
    fs.writeFileSync(iconPath, emptyPng);
  }

  createTray();
  createWindow();

  app.dock?.hide(); // Hide from dock on macOS
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
