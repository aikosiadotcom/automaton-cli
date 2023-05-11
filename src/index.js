#!/usr/bin/env node
import { Command } from "commander";

import Environment from "#lib/environment";
import ConfigCommand  from "#command/config/index";
import CreateCommand  from "#command/create/index";
import ShowCommand  from "#command/show/index";
import ExecCommand  from "#command/exec/index";
import ProfileCommand from "#command/profile/index";

if(process.env.NODE_ENV === undefined){
  process.env.NODE_ENV = 'production';
}

const environment = new Environment();
const program = new Command("automaton");
program
  .name("automaton")
  .description("Command Line Interface For Automaton Framework")
  .version("1.0.0")
  .exitOverride()

program.addCommand(new ConfigCommand({
  name:'config',
  description:'Manage the automaton-cli configuration.'
},environment));
program.addCommand(new CreateCommand({
  name:'create', 
  description:'Create boilerplate bot project of automaton framework.'
},environment));
program.addCommand(new ShowCommand({
  name:'show',
  description:'Show the automaton configuration.'
},environment));
program.addCommand(new ExecCommand({
  name:'exec',
  description:'Run the bot of automaton framework.'
},environment));
program.addCommand(new ProfileCommand({
  name:'profile',
  description:'Manage browser profiles.'
},environment));

try{
  await program.parseAsync(process.argv);
}catch(err){
  console.error(err.message);
}