import fsExtra from 'fs-extra';
import path from 'path';
import { isValidPath } from '@igor.dvlpr/valid-path';
import { Command } from "commander";
import {ProfileManager} from "@aikosia/automaton-daemon";

const pm = new ProfileManager();

async function create(name,option,command){
    if(isValidPath(name,false)){
        await pm.create(name);
    }else{
        console.error(`${name} is not a valid profile name.`);
    }
}

async function ls(name,option,command){
    const lists = await pm.get();

    console.log(`Total: ${lists.length}`);
    for(let i=0;i<lists.length;i++){
        console.log(`- ${lists[i].id}`);
    }
}

async function rm(name,option,command){
    if(isValidPath(name,false)){
        const newProfile = path.join(await pm.getPath(process.env.AUTOMATON_PATH_KEY_PROFILE),name);
        if(await fsExtra.exists(newProfile)){
            await fsExtra.rmdir(newProfile);
            console.log(`"${name}" remove successfully.`);
        }else{
            console.error(`profile "${name}" not found.`);
        }
    }else{
        console.error(`"${name}" is not a valid profile name.`);
    }
}

async function start(name,option,command){
    if(isValidPath(name,false)){
        const newProfile = path.join(await getPath(ENV.AUTOMATON_PATH_KEY_PROFILE),name);
        if(await fsExtra.exists(newProfile)){
            // const context = await chromium.launchPersistentContext(newProfile,{
            //     headless:false,
            //     ...devices['Desktop Chrome']
            // });
        }else{
            console.error(`profile ${name} not found.`);
        }
    }else{
        console.error(`${name} is not a valid profile name.`);
    }
}

function ProfileCommand(){
    const cmd = new Command('profile');
    cmd.description("Profile Management");
  
    cmd.command('create')
    .description('Create a browser\'s profile.')
    .argument('<name>', 'Name of your profile')
    // .option('--auto-start', 'Auto start at daemon bootstrap', false)
    .action(create);

    cmd.command('ls')
    .description('List of all your created profile.')
    .action(ls)

    cmd.command('rm')
    .description('Remove a browser\'s profile.')
    .argument('<name>', 'name of your profile')
    .action(rm);

    
    // cmd.command('start')
    // .description('Start a browser\'s profile.')
    // .argument('<name>', 'name of your profile')
    // .action(start);

    return cmd;
}

export default ProfileCommand;