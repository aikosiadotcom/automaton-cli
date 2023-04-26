import { Command } from "commander";
import fsExtra from 'fs-extra';
import { execSync }  from 'child_process';
import path from "path";
import { modifyJsonFile } from "modify-json-file";
import capitalize from 'capitalize';

async function _checkExists(projectPath){
    try {
        await fsExtra.mkdir(projectPath);
      } catch (err) {
        if (err.code === 'EEXIST') {
          console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
        } else {
          console.log(error);
        }
        process.exit(1);
      }
}

async function create(name,option,command){
    const projectName = `automaton-plugin-${option["template"]}-${name}`;
    const scope = "@aikosia"
    const currentPath = process.cwd();
    const fullProjectName = `${scope}/${projectName}`;
    const projectPath = path.join(currentPath, projectName);
    const git_repo = "https://github.com/aikosiadotcom/automaton-boilerplate.git";

    if(!['rest','crawler','etl'].includes(option["template"])){
      console.error(`template ${option["template"]} not exists. Please using automaton create --help to show available arguments`);
      return;
    }

    if(fsExtra.existsSync(projectPath)){
      console.error(`${projectPath} exists. please remove it first`);
      return;
    }

    const result = JSON.parse(execSync(`npm search ${fullProjectName} --json --no-description --prefer-online`).toString());
    
    if(result.length){
      if(result.filter(val=>val.name.trim() == `${fullProjectName}`).length){
        console.error(`${name} or ${fullProjectName} found on npm registry`);
        return;
      }
    }

    try {
    
        await _checkExists(projectPath);

        console.log('Downloading files...');
        execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);
  
        process.chdir(projectPath);

        //modify json
        await modifyJsonFile(
          path.join(projectPath, "package.json"),
          {
              name: s => `${fullProjectName}`,
              repository: s => Object.assign(s,{
                "url":`https://github.com/aikosiadotcom/${projectName}`
              }),
              automaton: s => Object.assign(s,{
                "template":`${option["template"]}`
              })
          }
        );

        if(option["template"] == 'rest'){
          const className = capitalize.words(projectName.split("-").join(" ")).split(" ").join("");
          console.log(className);
        await fsExtra.writeFile(path.join(projectPath,"src","index.js"),
`import Automaton, { Decorators } from "@aikosia/automaton-core";

class ${className} extends Automaton{
    constructor(){
        super({key:"${className}"});
    }

    async print({name}){
        return \`Hello, \$\{name\}\`;
    }
}

export default ${className};`);
        }
  
        console.log('Installing dependencies...');
        execSync('npm install');

//         console.log('Create .env file...');
//         await fsExtra.writeFile(path.join(projectPath,".env"),
// `#daemon connection
// AUTOMATON_DAEMON_HOST=
// AUTOMATON_DAEMON_PORT=

// #database connection
// AUTOMATON_SUPABASE_URL=
// AUTOMATON_SUPABASE_KEY=
//         `);
  
        console.log('Removing useless files');
        execSync('npx rimraf ./.git');
  
        console.log('The installation is done, have fun !');
  
      } catch (error) {
        console.log(error);
      }
}

function CreateCommand(){
    const cmd = new Command('create');
  
    cmd
    .description('Create a automaton bot project')
    .argument("<name>","project name")
    .option("-t, --template <value>", 'available template: rest, crawler, etl', "crawler")
    .action(create);

    return cmd;
}

export default CreateCommand