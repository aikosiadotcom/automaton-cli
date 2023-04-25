import { Command } from "commander";
import fsExtra from 'fs-extra';
import { execSync }  from 'child_process';
import path from "path";

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
    const projectName = name;
    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);
    const git_repo = "https://github.com/aikosiadotcom/automaton-boilerplate.git";

    const fullProjectName = `@aikosia/automaton-rest-${name}`;

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
  
        console.log('Installing dependencies...');
        execSync('npm install');

        console.log('Create .env file...');
        await fsExtra.writeFile(path.join(projectPath,".env"),
`#daemon connection
AUTOMATON_DAEMON_HOST=
AUTOMATON_DAEMON_PORT=

#database connection
AUTOMATON_SUPABASE_URL=
AUTOMATON_SUPABASE_KEY=
        `);
  
        console.log('Removing useless files');
        execSync('npx rimraf ./.git');
  
        console.log('The installation is done, this is ready to use !');
  
      } catch (error) {
        console.log(error);
      }
}

function CreateCommand(){
    const cmd = new Command('create');
  
    cmd
    .description('Create a automaton bot project')
    .argument("<name>","project name")
    .option("-t, --template", 'available template: rest, crawler, etl')
    .action(create);

    return cmd;
}

export default CreateCommand