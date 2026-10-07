export {}

declare global {
    interface Window {
        electronAPI: {
            runCommand: any,
            openFolder: any,
            onCommandOutput: any
        }
    }
}