#!/usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from "commander";
import ExecCommand  from "./command/exec.js";
import ProfileCommand  from "./command/profile.js";
import ShowCommand  from "./command/show.js";
import CreateCommand  from "./command/create.js";


const program = new Command("automaton");

program
  .name("automaton")
  .description("create & deploy your bot in seconds.")
  .version("1.0.0")

program.addCommand(CreateCommand());
program.addCommand(ExecCommand());
program.addCommand(ProfileCommand());
program.addCommand(ShowCommand());

(async()=>{
  program.parseAsync(process.argv);
})();