import { app, BrowserWindow, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { ipcMain } from "electron";
import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    icon: path.join(__dirname, "../assets/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function runCommand(userCommands: string, cwd?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("COMMAND:", userCommands);
    console.log("CWD:", cwd);
    console.log("SHELL:", process.env.ComSpec);
    console.log("USERPROFILE:", process.env.USERPROFILE);
    console.log("PATH:", process.env.PATH);
    const child = spawn(userCommands, {
      cwd,
      shell: process.env.ComSpec || "cmd.exe",
    });

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
      console.log(output);

      const text = data.toString();
      mainWindow.webContents.send("command-output", {
        type: "stdout",
        command: userCommands,
        text,
      });
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.log(errorOutput);
      const text = data.toString();
      mainWindow.webContents.send("command-output", {
        type: "stderr",
        command: userCommands,
        text,
      });
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(errorOutput || `command failed with code ${code}`);
      }
    });

    child.on("error", (error) => {
      reject(error.message);
    });
  });
}

ipcMain.handle(
  "run-command",
  async (_event, userCommands: string[], directoryPath: string) => {
    const results = [];

    try {
      for (const command of userCommands) {
        console.log("Running:", command);

        try {
          const output = await runCommand(command, directoryPath);

          results.push({
            command,
            success: true,
            output,
          });
        } catch (error) {
          results.push({
            command,
            success: false,
            error: String(error),
          });

          throw error;
        }
      }

      return {
        success: true,
        results,
      };
    } catch (error) {
      return {
        success: false,
        results,
        error: String(error),
      };
    }
  },
);

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
});
