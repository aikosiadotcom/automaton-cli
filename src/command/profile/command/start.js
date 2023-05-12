import BaseCommand from "#lib/base_command";
import {BrowserManager} from "@aikosia/automaton-daemon";

class StartCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("<name>","Profile name") 
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(arg,option,command){
        const bm = new BrowserManager({
            profile:{
                name:arg
            },
            expose:false
        });
        
        await bm.run();
    }
}

export default StartCommand;