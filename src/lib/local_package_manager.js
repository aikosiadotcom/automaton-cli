import { Runtime } from "@aikosia/automaton-core";

class LocalPackageManager extends Runtime.InterfacePackageManager{
    constructor(name){
        super();

        this.name = name;
    }

    root(){
        return process.cwd();
    }

    ls(){
        return {
            [this.name]:{}
        }
    }
}

export default (projectName)=>new LocalPackageManager(projectName)