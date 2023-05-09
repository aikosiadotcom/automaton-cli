import BaseCommand from "#lib/base_command";
import { Constants, Runtime } from "@aikosia/automaton-core";
import prompts from "prompts";
import path from 'path';
import { execSync }  from 'child_process';
import fsExtra from 'fs-extra';
import { modifyJsonFile } from "modify-json-file";
import capitalize from 'capitalize';

class CreateCommand extends BaseCommand{
    constructor(options,environment){
        super(options,environment);

        this.cmd
        .argument("[name]","Bot name")
        .option(`-t, --template <value>`, `available template: ${Runtime.Manifest.template.join(", ")}`,`${Runtime.Manifest.template[1]}`)
        .option(`-i, --interactive`, `interactive`,false)
        .option(`-d, --description [value]`, `describe what your automaton bot does.`,`Describe what your automaton bot does ?`)
        .option(`--create-env`, `use local .env file instead of global .env`,false)
        .option(`--sub-folder [value]`, `create the project into sub folder of root directory`,"")
        .option(`--skip-install`, `Skip npm install`,false)
        .action(this.action.bind(this));

        return this.cmd;
    }

    async action(arg,option){
        try{
            if(option.interactive === true){
                const questions = [
                    {
                        type: 'text',
                        name: 'name',
                        message: "Let's give it a really cool name?",
                        validate: value => value.length > 50 || value.length < 3 ? `Sorry, name should be > 3 and <= 50` : true
                    }, 
                    {
                        type: 'text',
                        name: 'description',
                        message: "Let's describe what your bot does?",
                        validate: value => value.length > 250 || value.length < 3 ? `Sorry, description should be > 3 and <= 250` : true
                    }, 
                    {
                        type: 'confirm',
                        name: 'useTemplateRest',
                        message: 'Do you want your bot to be access through REST API Request?'
                    },
                    {
                        type: 'confirm',
                        name: 'createEnv',
                        message: 'Do you want to create local .env?'
                    },
                ];
                const response = await prompts(questions);
                await this.create({name:response.name,description:response.description,template:response.useTemplateRest ? 'rest' : 'crawler',createEnv:response.createEnv,subFolder:"",skipInstall:false});
            }else{
                if(arg === undefined){
                    throw new Error("missing argument 'name'");
                }

                await this.create({name:arg,template:option.template,description:option.description,createEnv:option.createEnv,subFolder:option.subFolder,skipInstall:option.skipInstall});
            }
        }catch(err){
            // console.error(err.message);
            throw err;
        }
    }

    async create({name,template,description,createEnv,subFolder,skipInstall}){
        if(name.length < 3 || name.length >50){
            throw new Error(`Sorry, name should be > 3 and <= 50`);
        }

        if(!Runtime.Manifest.template.includes(template)){
            throw new Error(`template '${template}' not exists. Please use command 'automaton create --help' to show available arguments`);
        }

        const projectName = `${Constants.PROJECT_BOT_PREFIX[template]}${name}`;
        const scope = this.environment.config.get('project.bot.scope');
        const repository = this.environment.config.get('project.bot.repository');
        const fullProjectName = scope.length ? `${scope}/${projectName}` : projectName;
        const projectRootPath = path.join(process.cwd(), subFolder.length ? subFolder : "",projectName);
        const gitRepo = this.environment.config.get('project.bot.boilerplate');

        if(fsExtra.existsSync(projectRootPath)){
            throw new Error(`Error: ${projectRootPath} exists. please remove it first`);
        }

        const result = await Runtime.getPackageManager().search(fullProjectName);
        
        if(result.length){
            if(result.filter(val=>val.name.trim() == `${fullProjectName}`).length){
                throw new Exception(`${fullProjectName} found on registry. Please use another name`);
            }
        }

        //1. download the project and cd into it
        console.log('Downloading files...');
        execSync(`git clone --depth 1 ${gitRepo} ${projectRootPath}`);
        
        const tmpCwd = process.cwd();
        process.chdir(projectRootPath);

        //2. adjust the package.json
        await modifyJsonFile(
          path.join(projectRootPath, "package.json"),
          {
              name: s => `${fullProjectName}`,
              repository: s => Object.assign(s,{
                "url":`${repository}/${projectName}`
              }),
              description: s => description,
              //remove asterisker dependencies
              asterisker: s => undefined,
              devDependencies: s => {
                delete s["@aikosia/asterisker"];
                return s;
              },
              scripts: s => {
                return JSON.parse(JSON.stringify(s).replace(/asterisker -l && /g,""));
              }
          }
        );

        //3. adjust the automaton.config.json
        await modifyJsonFile(
            path.join(projectRootPath, "automaton.config.json"),
            {
                template: s => `${template}`,
                runParameter:s=>template == 'rest' ? 'context': s
            }
        );

        //4. create index.js based on template
        const className = capitalize.words(projectName.split("-").join(" ")).split(" ").join("");
        const mainFilepath = path.join(projectRootPath,"src","index.js");
        await fsExtra.copy(path.join(projectRootPath,"src","templates",`${template}.js`),path.join(projectRootPath,"src",`index.js`));

        //5. adjust content of index.js
        let t = await fsExtra.readFile(mainFilepath, {encoding:'utf8'});
        t = t.replace(/BotName/g,className).replace(/\[BOT_NAME\]/g,);
        await fsExtra.writeFile(mainFilepath,t);

        //6. create .env files?
        createEnv ? null : await fsExtra.remove(path.join(projectRootPath,".env"));
  
        //7. cleanup
        console.log('Removing useless files');
        execSync('npx rimraf ./.git ./src/templates ./CHANGELOG.md');
        fsExtra.ensureFileSync(path.join(projectRootPath,'CHANGELOG.md'));

        //8. install dependencies
        console.log('Installing dependencies...');
        skipInstall ? null : execSync('npm install');
  
        console.log('The installation is done, have fun !');
  
        process.chdir(tmpCwd);
    }


}

export default CreateCommand