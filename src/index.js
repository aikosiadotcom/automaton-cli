#!/usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();
import {readPackage} from 'read-pkg';
const json = await readPackage();

import { Command } from "commander";
import ExecCommand  from "./command/exec.js";
import ProfileCommand  from "./command/profile.js";
import ShowCommand  from "./command/show.js";
import CreateCommand  from "./command/create.js";


const program = new Command("automaton");

program
  .name("automaton")
  .description("create & deploy your bot in seconds.")
  .version(json.version)

program.addCommand(CreateCommand());
program.addCommand(ExecCommand());
program.addCommand(ProfileCommand());
program.addCommand(ShowCommand());

(async()=>{
  program.parseAsync(process.argv);
})();