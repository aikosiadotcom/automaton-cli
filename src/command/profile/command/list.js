import BaseCommand from "#lib/base_command";
import {ProfileManager} from "@aikosia/automaton-daemon";

class ListCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .option(`--json`, `show in json format`,false)
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    async action(options){
        const pm = new ProfileManager();
        const ls = await pm.get();
        if(options.json === false){
            console.log("Total:",`${ls.length}`);
            ls.forEach((val,index)=>{
                console.log(`${(index+1)}.`,val.name);
            });
        }else{
            console.dir(ls);
        }
    }
}

export default ListCommand;