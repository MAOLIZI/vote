const router = require('api');
const Files = require("../models/files");
const token = require('util/token');

let File = {

  async uploadFile  (body){
    let m = {
      filename: body.filename,
      path: body.path,
      from: body.from,
      createdAt: new Date,
      updatedAt: new Date
    };
    try {
      let file = await Files.create(m);
      return file.id;
    } catch(e) {
      return false;
    }
  },
  async getFileById(id){
    let file = await Files.findById(id);
    if(file){
      return file;
    }
    return false;
  },
  async getFiles(){
    let files = await Files.find();
    return files.map(m=> {
      let obj = Object.assign({}, {
        filename: files.filename,
        path: files.path,
        from: files.from
        } || {}, {
          filename: files.filename,
          path: files.path,
          from: files.from
      });
      return obj;
    });
  },
  async updateFile(id,body){
    let dataItem = await Files.findById(id);
    if(dataItem){
      let m = {
        filename: body.filename,
        path: body.path,
        from: body.from,
        createdAt: new Date,
        updatedAt: new Date
      };
      try {
        let file = await dataItem.updateAttributes(m);
        return file.id;
      } catch(e) {
        return false;
      }
    }else{
      return false;
    }
  },
  async deleteFile(id){
    let dataItem = await Files.findById(id);
    if(dataItem){
      await dataItem.destroy();
      return true;
    }else{
      return false;
    }
  }
}

module.exports = File;
