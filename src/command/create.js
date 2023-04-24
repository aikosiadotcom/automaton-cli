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

    await _checkExists(projectPath);

    try {
        console.log('Downloading files...');
        execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);
  
        process.chdir(projectPath);
  
        console.log('Installing dependencies...');
        execSync('npm install');
  
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
    .action(create);

    return cmd;
}

export default CreateCommand