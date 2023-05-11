import BaseCommand from "#lib/base_command";
import {ProfileManager} from "@aikosia/automaton-daemon";

class DeleteCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("<name>","Profile name") 
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(name){
        const pm = new ProfileManager();
        await pm.delete(name);
    }
}

export default DeleteCommand;