const fs = require('fs')
const path = require('path')

const createOutputFolder = async () => {
    const pathToOutputFolder = path.resolve(__dirname, 'project-dist')
    fs.promises.mkdir(pathToOutputFolder, { recursive: true })
}

const readTemplate = async () => {
    const pathToTemplate = path.resolve(__dirname, 'template.html')
    let template = ''
    const stream = fs.createReadStream(pathToTemplate, 'utf-8')
    for await (const chunk of stream) {
        template += chunk
    }
    return template
}

const getHTMLComponents = async () => {
    const pathToFolder = path.resolve(__dirname, 'components')
    const components = await fs.promises.readdir(pathToFolder, { withFileTypes: true, })
    return components.filter(component => path.extname(component.name) === '.html').map(component => path.basename(component.name, '.html'))
}

const replaceTemplate = async (template, components) => {
    return Promise.all(components.map(component => new Promise((resolve) => {
        const pathToComponent = path.resolve(__dirname, 'components', `${component}.html`)
        let componentContent = ''
        const stream = fs.createReadStream(pathToComponent)
        stream.on('data', chunk => { componentContent += chunk })
        stream.on('end', () => {
            template = template.replace(`{{${component}}}`, componentContent)
            resolve()
        })
    }))).then(() => template)
}

const createHTML = async () => {
    const pathToHTML = path.resolve(__dirname, 'project-dist', 'index.html')
    const stream = fs.createWriteStream(pathToHTML)
    const template = await readTemplate()
    const htmlComponents = await getHTMLComponents()
    const htmlBundle = await replaceTemplate(template, htmlComponents)
    stream.write(htmlBundle)
}

const createCSS = async () => {
    const pathToFolder = path.resolve(__dirname, 'styles')
    const pathToOutput = path.resolve(__dirname, 'project-dist', 'style.css')
    const files = await fs.promises.readdir(pathToFolder)
    let bundle = ''
    for (const file of files) {
        let stream = fs.createReadStream(path.resolve(__dirname, 'styles', file), 'utf-8')
        for await (const chunk of stream) {
            bundle += chunk +'\n'
        }
    }
    const output = fs.createWriteStream(pathToOutput)
    output.write(bundle)
    output.end()
}

const copyAssets = async (from, to) => {
    await fs.promises.rm(to, { recursive: true, force: true });
    await fs.promises.mkdir(to, { recursive: true })
    const files = await fs.promises.readdir(from)
    for (const file of files) {
        fs.stat(path.resolve(from, file), (error, stats) => {
            if (error) return console.error(error.message)
            if (!stats.isDirectory()) {
                fs.promises.copyFile(path.resolve(from, file), path.resolve(to, file))
            } else {
                copyAssets(path.resolve(from, file), path.resolve(to, file))
            }
        })
    }
}

const build = async () => {
    const pathToFolder = path.resolve(__dirname, 'assets')
    const pathToOutput = path.resolve(__dirname, 'project-dist', 'assets')
    await createOutputFolder()
    await createHTML()
    await createCSS()
    await copyAssets(pathToFolder, pathToOutput)
}

build()
