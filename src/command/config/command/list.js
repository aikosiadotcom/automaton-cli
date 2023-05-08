import BaseCommand from "#lib/base_command";

class ListCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    action(args,option,command){
        this.environment.output(this.environment.config.get());
    }
}

export default ListCommand;