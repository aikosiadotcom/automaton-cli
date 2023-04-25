import { Command } from "commander";

const msgAvailableArgs = "Available arguments: \'env\', \`path\`";

import {ProfileManager} from "@aikosia/automaton-daemon";
const pm = new ProfileManager();

async function show(name,option,command){
    if(name == 'env'){
        const out = {NODE_ENV:process.env.NODE_ENV};
        for(const [key,value] of Object.entries(process.env)){
            if(key.startsWith("AUTOMATON_")){
            out[key] = value;
            }
        }
        console.dir(out);
    }else if(name == 'path'){
        console.dir(await pm.getPath());
    }else{
        console.error(`invalid argument. ${msgAvailableArgs}`);
    }
}

function ShowCommand(){
    const cmd = new Command('show');
  
    cmd
    .description('Information Management')
    .argument("<name>",msgAvailableArgs)
    .action(show);

    return cmd;
}

export default ShowCommand