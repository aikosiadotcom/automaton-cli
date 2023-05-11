import BaseCommand from "#lib/base_command";
import {Runtime} from "@aikosia/automaton-core";
import {Daemon} from "@aikosia/automaton-daemon";
import getLocalPackageManager from "#lib/local_package_manager";
import {readPackage} from 'read-pkg';
import chokidar from "chokidar";
import path from 'path';
import fsExtra from 'fs-extra';

class ExecCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .option(`-h, --host [value]`, `override value of AUTOMATON_DAEMON_HOST local or global .env file`,``)
        .option(`-p, --port [value]`, `override value of AUTOMATON_DAEMON_PORT local or global .env file`,``)
        .option(`-w, --watch`, `watch for changes`,false)
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(option){
        const daemon = await this.run(option);
        if(option.watch == true){
            chokidar.watch([
                path.join(process.cwd(),"src"),
                path.join(process.cwd(),'automaton.config.json')
            ],{
                ignoreInitial:true
            }).on('all', async (event, path) => {
                console.log(event,`${path}`);
                await daemon.reloadRuntime();
            });
        }
    }

    async run(option){
        console.log("env: ",process.env.NODE_ENV);
        console.log("cwd: ",process.cwd());

        const manifest = await Runtime.Manifest.get();
        //get the project name
        const pkg = await readPackage();
        const daemon = new Daemon({
            host:option.host,
            port:option.port,
            browser:{
                profile:{
                    name:manifest.profile
                },
                expose:false
            },
            runtime:{
                packageManager:getLocalPackageManager(pkg["name"])
            }
        });
        daemon.event.on("error",err=>{
            console.log(err);
        });
        await daemon.run();

        return daemon;
    }
}

export default ExecCommand;