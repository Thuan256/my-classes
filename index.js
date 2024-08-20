const fs = require('node:fs');
const path = require('path');

function loadModules(directory) {
    const modules = {};
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const moduleName = path.basename(file, path.extname(file));

        delete require.cache[require.resolve(filePath)]
        const loadedModule = require(filePath);

        if (typeof loadedModule === 'object' && loadedModule !== null) {
            Object.assign(modules, loadedModule);
        } else {
            modules[moduleName] = loadedModule;
        }
    });

    return modules;
}

const classesPath = path.resolve(__dirname, '../../classes');
const classes = loadModules(classesPath);

module.exports = classes;
