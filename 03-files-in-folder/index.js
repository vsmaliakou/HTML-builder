const { readdir } = require('fs/promises')
const path = require('path')
const { stat } = require('fs')

const pathToFolder = path.resolve(__dirname, 'secret-folder')

const getFilesInformation = async () => {
    try {
        const files = await readdir(pathToFolder)
        for (let i = 0; i < files.length; i++) {
            const pathToCheck = path.resolve(pathToFolder, files[i])
            stat(pathToCheck, (error, stats) => {
                if (error) return console.error(error.message)
                if (!stats.isDirectory()) {
                    const fileExt = path.extname(files[i])
                    const fileName = path.basename(files[i], fileExt)
                    const fileWeight = stats.size / 1000
                    console.log(`${fileName} - ${fileExt.slice(1)} - ${fileWeight}kb`)
                }
            })
        }
    } catch (err) {
        console.error(err)
    }
}

getFilesInformation()
