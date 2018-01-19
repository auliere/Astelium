import {Server, RestCallback, HttpRequest, RequestMethod} from './server'
const fs = require('fs');
import * as path from 'path'

const server = new Server('localhost', process.env.PORT);

server.staticResources = [
    "client/static/audio",
    "client/static/fonts",
    "client/static/images",
    "client/static/scripts",
    "client/static/styles",
    "client/static/views",    
];

const saveFile = (req, res) => {    
    console.log('State', req.body.state.storage.players[0]);
    fs.appendFile(`${__dirname}/saves/${req.body.name}.json`, JSON.stringify(req.body), (err) => {
        if(err) {
            throw err;
        }         
    });   
}

const showAllSaveFiles = (req, res) => {
    fs.readdir(`${__dirname}/saves`, (err, list) => {
        if(err) {
            throw err;
        }      
        res.send({saves: list.map(save => save.replace(/.json/, ''))});       
    });    
}

const loadFile = (req, res) => {    
    fs.readFile(`${__dirname}/saves/${req.body.name}.json`, 'utf8', (err, data) => {        
        if(err) {
            throw err;
        }
        res.send(JSON.parse(data)); 
    });     
}

server.restMapping = new Map<HttpRequest, RestCallback>([
    [{url: '/', method: RequestMethod.GET}, (req, res) => {
        res.sendFile(`/index.html`);
    }],
    [{url: '/save', method: RequestMethod.POST}, saveFile],
    [{url: '/showAllSaves', method: RequestMethod.GET}, showAllSaveFiles],
    [{url: '/load', method: RequestMethod.POST}, loadFile],
]);

server.start();