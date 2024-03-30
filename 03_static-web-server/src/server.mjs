const HOST = '127.0.0.1';
const PORT = 3000;

import * as webLib from './web-lib.mjs';
import * as path from "path";
import * as fs from "fs";

import { fileURLToPath } from 'url';

// TODO: configure and start server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

fs.readFile(path.join(__dirname, 'config.json'), 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const config = JSON.parse(data);
    const server = new webLib.HTTPServer(config.root_directory, config.redirect_map);
    server.listen(PORT, HOST);
});