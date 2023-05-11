import { Command } from "commander";
import {Tests} from '@aikosia/automaton-core';
import {jest} from '@jest/globals';
import {resolve} from 'import-meta-resolve';

await Tests.createMockApp(jest);
const Environment = (await import(resolve('#lib/environment',import.meta.url))).default; 

async function main(TestCommandClass,args){
    const environment = new Environment();
    const program = new Command("automaton");
    program
      .exitOverride()
      .name("automaton")
      .action(()=>{})
    
    program.addCommand(new TestCommandClass({
        name:'test',
        description:'test'
    },environment));

    try{
      await program.parseAsync([
        "node",
        "automaton",
        "test",
      ].concat(args));
    }catch(err){
      throw err;
    }

    return program;
}

export default (TestCommandClass,args)=>main(TestCommandClass,args);