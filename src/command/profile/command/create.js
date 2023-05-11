import BaseCommand from "#lib/base_command";
import {ProfileManager} from "@aikosia/automaton-daemon";

class CreateCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("<name>","Profile name") 
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(arg,option,command){
        const pm = new ProfileManager();
        await pm.create(arg);
    }
}

export default CreateCommand;