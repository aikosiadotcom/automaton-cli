import BaseCommand from "#lib/base_command";

class ResetCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("<key...>","Reset top level properties to default. use key 'all' to reset all the config to default. If the key not found, then nothing will happen.")
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    action(args,option,command){
        if(args.length === 1 && args[0] == 'all'){
            this.environment.config.clear();
        }else{
            console.log(args);
            this.environment.config.reset(...args);
        }
    }
}

export default ResetCommand;