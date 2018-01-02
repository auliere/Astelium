import express from 'express'

export interface RestCallback {
    (req: any, res?: any, err?: Error): void
}

export class Server {

    private _host: string;
    private _port: number;
    private _restMapping: Map<string, RestCallback>;
    private _staticFolders: string[];

    constructor(host?: string, port?: number, restMapping?: Map<string,
         RestCallback>, staticFolders?: string[]) {
        this._host = host || 'localhost';
        this._port = port || 3000;        
        this._restMapping = restMapping || new Map<string, RestCallback>([
            [this._host, (req, res) => res.send('Whitelabel page...')]
        ]);
        this._staticFolders = staticFolders || ['public', 'static'];
    }

    get host(): string {
        return this._host;
    }

    set host(host: string) {
        this._host = host;
    }

    get port(): number {
        return this._port;
    }

    set port(port: number) {
        this._port = port;
    }

    get restMapping(): Map<string, RestCallback> {
        return this._restMapping;
    }

    set restMapping(restMapping: Map<string, RestCallback>) {     
        this._restMapping = restMapping;
    }

    get staticFolders(): string[] {
        return this._staticFolders;
    }

    set staticFolders(staticFolders: string[]) {
        this._staticFolders = staticFolders;
    }

    public start(): void {       
        const SERVER_INSTANCE = express();
        const ROOT_DIRECTORY = require('app-root-dir').get();        
        this._staticFolders.forEach((folder) => {           
            SERVER_INSTANCE.use(express.static(`${ROOT_DIRECTORY}/${folder}`));
        })       
        this._restMapping.forEach((callback, url) => {            
            console.log(callback.toString());
            SERVER_INSTANCE.get(url, callback)
        })
        SERVER_INSTANCE.listen(this._port, 
            () => console.log(`Server was started on http://${this._host}:${this._port}`))
    }
}