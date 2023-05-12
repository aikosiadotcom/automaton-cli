import BaseCommand from "#lib/base_command";
import CreateCommand from "#command/profile/command/create";
import ListCommand from "#command/profile/command/list";
import DeleteCommand from "#command/profile/command/delete";
import StartCommand from "#command/profile/command/start";

class ProfileCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .addCommand(new CreateCommand({
        name:'create',
        description:'Create a new profile.'
        },environment))
        .addCommand(new ListCommand({
        name:'ls',
        description:'List profiles.'
        },environment))
        .addCommand(new DeleteCommand({
        name:'rm',
        description:'Delete a profile.'
        },environment))
        .addCommand(new StartCommand({
        name:'start',
        description:'Start a profile.'
        },environment))
        
        return this.cmd;
    }
}

export default ProfileCommand;