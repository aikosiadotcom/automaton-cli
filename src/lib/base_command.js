import { Command } from "commander";
import Environment from "./environment.js";

class BaseCommand{

    /**
     * @param {object} options
     * @param {string} options.name - Name
     * @param {string} options.description - Description
     * @param {Environment} environment - Command will run on top of this environment
     */
    constructor(options,environment){
        this.cmd = new Command(options.name);
        this.cmd.description(options.description);

        this.environment = environment
    }

    /**
     * @param {[] | 'string'} argument
     * @param {object} option
     * @param {import("commander").Command} command 
     * @returns {Promise}
     */
    action(argument,option,command){}
}

export default BaseCommand;