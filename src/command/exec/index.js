import BaseCommand from "#lib/base_command";
import {Runtime} from "@aikosia/automaton-core";
import getLocalPackageManager from "#lib/local_package_manager";
import {readPackage} from 'read-pkg';

class ExecCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(arg,option,command){
        console.log("env: ",process.env.NODE_ENV);
        console.log("cwd: ",process.cwd());

        //get the project name
        const pkg = await readPackage();
        const runtime = new Runtime({packageManager:getLocalPackageManager(pkg["name"]),exitOnFinish:true});
        await runtime.run();
    }
}

export default ExecCommand;