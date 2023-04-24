import {describe,test,expect ,jest} from '@jest/globals';
import ShowCommand from './show.js';

test('getDefaultManifest',()=>{
    expect(new ShowCommand()).toHaveProperty("_allowUnknownOption",false);
})