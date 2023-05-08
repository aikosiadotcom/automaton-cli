import BaseCommand from "#lib/base_command";

class GetCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("[key]","Accessing nested properties by dot notation. If no keys are provided, then this command behaves the same as automaton config list")
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    action(arg,option,command){
        this.environment.output(this.environment.config.get(arg));
    }
}

export default GetCommand;