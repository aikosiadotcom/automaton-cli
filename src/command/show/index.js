import BaseCommand from "#lib/base_command";
import {App} from "@aikosia/automaton-core";

class ShowCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("[name]","The names of configuration to show. Availables: 'path', 'env'. Default to 'env'","env")  
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(arg,option,command){
        const app = new App({key:'automaton-cli',childKey:'show'});
        if(arg == 'env'){
            const out = {NODE_ENV:process.env.NODE_ENV};
            for(const [key,value] of Object.entries(process.env)){
                if(key.startsWith("AUTOMATON_")){
                out[key] = value;
                }
            }
            console.dir(out);
        }else if(arg == 'path'){
            console.log(app.explorer.path);
        }else{
            console.log(`unknown argument name of '${arg}'.`);
        }
    }
}

export default ShowCommand;