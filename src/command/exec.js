import { Command } from "commander";
import {Runtime} from '@aikosia/automaton-core';

async function exec(name,option,command){
    console.log("env: ",process.env.NODE_ENV);
    console.log("cwd: ",process.cwd());
    const runtime = new Runtime();
    await runtime.run(process.cwd());
}

function ExecCommand(){
    const cmd = new Command('exec');
  
    cmd
    .description('runtime automaton for developer')
    // .argument("[path]","Absolute path to your root project")
    .action(exec);

    return cmd;
}

export default ExecCommand