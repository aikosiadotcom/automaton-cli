import {describe,test,expect ,jest} from '@jest/globals';
import getMockProgram from '#mock/program';
import CreateCommand from '#command/create/index';
import path from 'path';
import fsExtra from 'fs-extra';
import { Constants, Runtime } from "@aikosia/automaton-core";
import {readPackage} from "read-pkg";
import {loadJsonFile} from 'load-json-file';
import capitalize from 'capitalize';

const testCase = async(commandArgument,opts)=>{
    const name = opts.name;
    const template = opts.template == 'default' ? Runtime.Manifest.template[1] : opts.template;
    const projectName = `${Constants.PROJECT_BOT_PREFIX[template]}${name}`;
    const scope = "@aikosia";
    const fullProjectName = scope.length ? `${scope}/${projectName}` : projectName;
    const projectRootPath = path.join(process.cwd(), ".automaton",projectName);

    if(await fsExtra.exists(projectRootPath)){
        await fsExtra.remove(projectRootPath);
    }

    await getMockProgram(CreateCommand,commandArgument);

    expect(fsExtra.existsSync(projectRootPath)).toBeTruthy();
    expect(fsExtra.existsSync(path.join(projectRootPath,"node_modules"))).toBeFalsy();
    const pkg = await readPackage({cwd:projectRootPath});
    
    expect(pkg["name"]).toBe(fullProjectName);
    expect(pkg["devDependencies"]["@aikosia/asterisker"]).toBeUndefined();
    expect(pkg["description"]).toEqual(opts.description);
    expect(JSON.stringify(pkg["scripts"])).not.toContain("asterisker -l &&");
    
    expect(fsExtra.existsSync(path.join(projectRootPath,"automaton.config.json"))).toBeTruthy();
    const automatonConfig = await loadJsonFile(path.join(projectRootPath,"automaton.config.json"));
    expect(automatonConfig["template"]).toBe(template);

    const mainFilepath = path.join(projectRootPath,"src","index.js");
    const className = capitalize.words(projectName.split("-").join(" ")).split(" ").join("");

    let t = await fsExtra.readFile(mainFilepath, {encoding:'utf8'});
    expect(t).toContain(className);

    if(opts.createEnv){
        expect(await fsExtra.exists(path.join(projectRootPath,".env"))).toBeTruthy();
    }
}

beforeEach(()=>{
    jest.resetModules();
    jest.resetAllMocks();
});

describe('given CreateCommand class', () => {
    describe("when name not satisfy the requirements",()=>{
        test("then should throw error",async ()=>{
            try{
                expect.assertions(1);
                await getMockProgram(CreateCommand,["xx"]);
            }catch(err){
                expect(err.toString()).toContain("name");
            }
        });
    });

    describe("when command is create --sub-folder .automaton -d hello,jen!",()=>{
        test("then the created project should inside .automaton with all default value",async ()=>{
            await testCase(["jen-01","--skip-install","--sub-folder",".automaton","-d","hello,jen!"],{template:'default',description:'hello,jen!',name:'jen-01'});
        },30000);
    });

    describe("when command is create --sub-folder .automaton -t crawler -d hello again, jen!",()=>{
        test("then the created project should inside .automaton and work as expected",async ()=>{
            await testCase(["jen-02","--skip-install","--sub-folder",".automaton","-t","crawler","-d","hello again, jen!","--create-env"],{template:'crawler',description:'hello again, jen!',name:'jen-02',createEnv:true});
        },30000);
    });
});
 