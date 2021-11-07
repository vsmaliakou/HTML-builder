const fs = require('fs')
const path = require('path')

const copyDir = async () => {
    await fs.promises.rm(path.resolve(__dirname, 'files-copy'), { recursive: true, force: true });
    await fs.promises.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true }, error => {
        if (error) return console.error(error.message)
    })
    const files = await fs.promises.readdir(path.resolve(__dirname, 'files'))
    for (const file of files) {
        const pathFrom = path.resolve(__dirname, 'files', file)
        const pathTo = path.resolve(__dirname, 'files-copy', file)
        fs.copyFile(pathFrom, pathTo, (err) => {
            if (err) return console.error(err.message)
        })
    }
    console.log('Copying completed') 
}

copyDir()
