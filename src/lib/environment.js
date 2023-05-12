import {App,Constants} from "@aikosia/automaton-core";
import Conf from 'conf';

class Environment extends App{
  constructor(){
    super({key:"automaton-cli",childKey:"config"});

    this.config = new Conf({
      configName:"automaton-cli",
      projectVersion:"1.0.0",
      cwd:this.explorer.path.config,
      schema:{
        project:{
          type:"object",
          default:{},
          properties:{
            bot:{
              default:{},
              type:"object",
              properties:{
                scope:{
                  type:"string",
                  default:"@aikosia"
                },
                boilerplate:{
                  type: 'string',
                  format: 'uri',
                  default: 'https://github.com/aikosiadotcom/automaton-boilerplate.git'
                },
                repository:{
                  type: 'string',
                  format: 'uri',
                  default: 'https://github.com/aikosiadotcom'
                },
                include:{
                  type: 'array',
                  default: Constants.PROJECT_BOT_INCLUDE,
                  uniqueItems: true,
                  items:{type:"string",format:"regex"}
                },
                exclude:{
                  type: 'array',
                  default: Constants.PROJECT_BOT_EXCLUDE,
                  items:{type:"string",format:"regex"}
                }
              }
            }
          }
        }
      }
    });
  }

  output(obj){
    console.log(JSON.stringify(obj, null, 2));
  }
}

export default Environment;
