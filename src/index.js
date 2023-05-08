#!/usr/bin/env node
import { Command } from "commander";

import Environment from "#lib/environment";
import ConfigCommand  from "#command/config/index";
import CreateCommand  from "#command/create/index";
import ShowCommand  from "#command/show/index";
import ExecCommand  from "#command/exec/index";

const environment = new Environment();
const program = new Command("automaton");
program
  .name("automaton")
  .description("Command Line Interface For Automaton Framework")
  .version("1.0.0")

program.addCommand(new ConfigCommand({
  name:'config',
  description:'Manage the automaton-cli configuration'
},environment));
program.addCommand(new CreateCommand({
  name:'create', 
  description:'To create a new project (bot) of automaton framework'
},environment));
program.addCommand(new ShowCommand({
  name:'show',
  description:'Show the automaton configuration'
},environment));
program.addCommand(new ExecCommand({
  name:'exec',
  description:'To run project of automaton framework.'
},environment));

program.parseAsync(process.argv);