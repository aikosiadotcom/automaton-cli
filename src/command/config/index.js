import SetCommand from "#command/config/command/set";
import GetCommand from "#command/config/command/get";
import ListCommand from "#command/config/command/list";
import EditCommand from "#command/config/command/edit";
import ResetCommand from "#command/config/command/reset";
import BaseCommand from "#lib/base_command";

class ConfigCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd.addCommand(new SetCommand({
            name:'set',
            description:'Sets each of the config keys to the value provided.'
        },environment));
        this.cmd.addCommand(new GetCommand({
            name:'get',
            description:'Echo the config value(s) to stdout.'
        },environment));
        this.cmd.addCommand(new ListCommand({
            name:'list',
            description:'Show all the config settings.'
        },environment));
        this.cmd.addCommand(new EditCommand({
            name:'edit',
            description:'Opens the config file in an editor.'
        },environment));
        this.cmd.addCommand(new ResetCommand({
            name:'reset',
            description:'Reset each of the config keys to the default value.'
        },environment));
    
    
        return this.cmd;
    }
}

export default ConfigCommand