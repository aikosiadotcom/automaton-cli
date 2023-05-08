import BaseCommand from "#lib/base_command";

class SetCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("<key=value...>","Setting nested properties by dot notation. If value is omitted, then it sets it to an empty string.")
        .action(this.action.bind(this));
        
        return this.cmd;
    }

    action(args,option,command){
        try{
            const result = args.map((val)=>val.split("="))
                .filter(val=>val.length==2)
                .map((val)=>{
                    const isArray = val[1].split(",");
                    if(isArray.length){
                        return [val[0],isArray.map((val)=>val.trim()).filter((val)=>val.length!=0)];
                    }
                })
                result.forEach((val)=>{
                    if(this.environment.config.has(val[0])){
                        this.environment.config.set(val[0],val[1]);
                    }else{
                        console.info(`key '${val[0]}' not found and will be omitted`);
                    }
                });
        }catch(err){
            console.error(err.message);
        }
    }
}

export default SetCommand;