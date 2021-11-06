const fs = require('fs')
const path = require('path')

const { stdin, stdout, exit } = process

stdout.write('Enter text\n')
fs.createWriteStream(path.resolve(__dirname, 'text.txt'))
const filePath = path.join(__dirname, 'text.txt')

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') exit()    
    fs.readFile(filePath, (error, content) => {
        if (error) return console.error(error.message)
            const newContent = content.toString() + data
            fs.writeFile(filePath, newContent, (error) => {
                if (error) return console.error(error.message)
            })
        }
    )
})
process.on('SIGINT', exit)
process.on('exit', () => stdout.write('Good luck learning Node.js!'));