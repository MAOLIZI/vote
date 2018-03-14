const React = require("react");
const Form = require("表单");
const Input = require("表单/组件");
const server = require("通用/服务器");
const List = require("列表");

require("./index.less");

module.exports = React.createClass({
  getInitialState(){
    return {
      active:this.props.data?true:false,
      data:this.props.data,
      peoples:null,
    };
  },
  componentWillReveiceProps(nextProps){
    this.state.data = nextProps.data;
  },
  async componentWillMount(){
    let peoples = await server.get("/api/names/branch", {}, false);
    this.setState({peoples:peoples});
  },
  render(){
    return (<div key="modalPage" className="modalPage">
        {this.state.data && this.state.peoples?<div className="modal fade in"  style={{display:this.state.active?"block":"none"}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleClose}><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel">编辑</h4>
                </div>
                <div className="modal-body">
                  <Form onChange={this.handleChange} content={this.state.data} key={this.state.data.name+this.state.branch}>
                    <Input type="text" name="姓名" uuid="name" placeholder="姓名"/>
                    <Input type="select" name="部门" uuid="branch" options = {Object.keys(this.state.peoples)} placeholder="部门"/>
                  </Form>
                </div>
                <div className="modal-footer">
                  <div className="delBtnArea"><button type="button" className="btn btn-danger delBtn" onClick={this.handleDelete}>删除</button></div>
                  <button type="button" className="btn btn-default" onClick={this.handleClose}>关闭</button>
                  <button type="button" className="btn btn-primary" onClick={this.handleSave}>保存</button>
                </div>
              </div>
            </div>
          </div>:<div></div>}
      </div>

      )
  },
  async handleDelete(){
    if(this.state.data.usersId){
      let delNameRs = await server.sendDelete("/api/names/"+this.state.data.id);
      if(delNameRs !== "删除失败"){
        let delUserRs = await server.sendDelete("/api/users/"+this.state.data.usersId);
        if(delUserRs !=="删除失败"){
          let delEnrollmentsRs = await server.sendDelete("/api/enrollments/"+this.state.data.usersId);
          if(delEnrollmentsRs){
            alert("删除成功！");
            this.setState({active:false});
          }else{
            alert("删除失败!");
          }

        }
      }
    }else{
      let rs = server.sendDelete("/api/names/"+this.state.data.id);
      if(rs !== "删除失败"){
        alert("删除成功！");
        this.setState({active:false});
      }else{
        alert("删除失败！");
      }
    }
  },
  handleClose(){
    this.setState({active:false});
  },
  handleChange(content){
    this.setState(content);
  },
  async handleSave(){
    if(this.state.data.usersId){
      let nameInfo = {
        name:this.state.name,
        branch:this.state.branch,
        office:this.state.office,
        usersId:this.state.data.usersId
      }
      let name = await server.put("/api/names/"+this.state.data.id,nameInfo);
      if(name !=="修改失败"){
        let user = await server.put("/api/admin/users/"+this.state.data.usersId,nameInfo);
        if(user !=="修改失败"){
          alert("修改成功！");
          this.setState({active:false});
        }else{
          alert("修改失败！")
        }
      }
    }else{
      let nameInfo = {
        name:this.state.name,
        branch:this.state.branch,
      }
      let name = await server.put("/api/names/"+this.state.data.id,nameInfo);
      if(name !== "修改失败"){
        alert("修改成功！");
        this.setState({active:false});
        //this.props.onUpdate();
      }else{
        alert("修改失败！");
      }
    }

  }
})


