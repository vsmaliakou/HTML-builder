const fs = require('fs')
const path = require('path')

const createBundle = async () => {
    const files = await fs.promises.readdir(path.resolve(__dirname, 'styles'))
    let data = ''

    for await (const file of files) {
        if (path.extname(file) === '.css') {
            let stream = fs.createReadStream(path.resolve(__dirname, 'styles', file), 'utf-8')
            for await (const chunk of stream) {
                data += chunk
            }
        }
    }

    const output = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'))
    output.write(data)
    output.end()
}

createBundle()
