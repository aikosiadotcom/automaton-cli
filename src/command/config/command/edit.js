import BaseCommand from "#lib/base_command";
import open from 'open';

class EditCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(args,option,command){
        console.log(this.environment.config.path);
        await open(this.environment.config.path);
    }
}

export default EditCommand;