/**
 * autor：knight
 * Feature:规划功能
 */
/*eslint-disable*/
import {Modal, Button, Select,message, Transfer,Tabs,Table,Popover} from 'antd';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import SprintStore from '../../stores/origanization/sprint/SprintStore';

const TabPane = Tabs.TabPane;

const columns = [{
  title: '编号',
  dataIndex: 'issueId',
  width: '50px',
  render: (text, record) =>
    <div >#{text}</div>
  // sorter: (a, b) => parseInt(a.issueId.replace("#", "")) - parseInt(b.issueId.replace("#", "")),
}, {
  title: '描述',
  dataIndex: 'description',
  width: '140px',
  render: (text, record) =>
    <div style={{width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
      {text ? text.length > 20 && !text ? text.substring(0, 20) : text : "——"}</div>
}, {
  title: '状态',
  dataIndex: 'status',
  width: '80px',
  render: (text, record) =>
    <div style={{
      backgroundColor: "#ff9e4a",
      color: "#ffffff",
      borderRadius: "8px",
      marginLeft: "-5px",
      textAlign: "center"
    }}>{text}</div>},{
  title: '看板',
  dataIndex: 'kanbanName',
  width: '140px',
  render: (text, record) =>
    <div style={{width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
      {text ? text.length > 10 ? text.substring(0, 10) : text : "——"}</div>
}, {
  title: '认领人',
  dataIndex: 'owner',
  width: '90px',
}];

class SprintPlanModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mark:0,
      id: this.props.id,
      selectedRowKeys: [],//table的选中项
      targetKeys: [],
      selectedKeys: [],
      selectedTargetKeysCount: 0,
      storyGroup: [],
      cruStoryGroup: [],
      unFinishStory: [],
      cruReleasePlanId: "",
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id&&nextProps.id!=0) {
      this.initData(nextProps.id);
    }
  }

  initData = (id) => {
    SprintStore.getReleaseData().then(data => {
      SprintStore.getSprintById(id).then(sprintData => {
        if(sprintData) {
          let targetKeys = [];
          let cruStoryGroup = [];
          let unFinishStory = [];
          let storyGroup = [];
          let cruReleaseData = [];
          let list = [];
          let cruReleasePlanId = sprintData.releasePlanId;
          sprintData["issue"].map((option, index) => {
            if (option.issueType == "story" ) {
                targetKeys.push(option.id)
              if(option.status == "sprint backlog") {
                cruStoryGroup.push({
                  key: option.id,
                  title: option.description,
                  status:option.status
                })
                storyGroup.push({
                  key: option.id,
                  title: option.description,
                  status:option.status
                })
              }
              else{
                cruStoryGroup.push({
                  key: option.id,
                  title: option.description,
                  status:option.status,
                  disabled:true
                })
                storyGroup.push({
                  key: option.id,
                  title: option.description,
                  status:option.status,
                  disabled:true
                })
              }
            }
            if (option.issueType == "story" && option.status != "done") {
              console.log(option.subIssue)
              console.log(option.subIssue.length)
              unFinishStory.push({
                key: option.id,
                issueId: option.issueId,
                issueType: option.issueType,
                description: option.description,
                subIssue:option.subIssue,
                status: option.status,
                kanbanId: option.kanbanId,
              })
            }
          })
          data.map((item, index) => {
            if (item.id == cruReleasePlanId) {
              cruReleaseData=item;
              item["issues"].map((option, index) => {
                if(option.status=="product backlog") {
                  storyGroup.push({
                    key: option.id,
                    title: option.description,
                    status:option.status
                  });
                }
              })
            }
          })
          this.setState({
            mark:1,
            id: id,
            name:sprintData.name,
            cruReleaseData:cruReleaseData,
            targetKeys: targetKeys,
            cruStoryGroup: cruStoryGroup,
            unFinishStory: unFinishStory,
            storyGroup: storyGroup,
            cruReleasePlanId:cruReleasePlanId
          })
        }
        else {
          message.error("网络异常")
        }
      });
    })
  }

  renderItem = (item) => {
    const customLabel = (
      <div style={{display:"inline-block"}}>
        <div style={{display:"inline-block",width:"150px",width: '130px', whiteSpace: "nowrap", textOverflow:
          "ellipsis", overflow: "hidden",}}>{item.title}</div>
        <div style={{display:"inline-block",marginLeft:"10px",width:"90px",textAlign:"center"}}>{item.status}</div></div>
    );
    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    let moveData = [];
    let cruStoryGroup = JSON.parse(JSON.stringify(this.state.cruStoryGroup))
    let unFinishStory = JSON.parse(JSON.stringify(this.state.unFinishStory))
    console.log(unFinishStory)

    if (direction == "right") {
      for (let i = 0; i < moveKeys.length; i++) {
        moveData.push({
          id: moveKeys[i],
          sprintId: this.state.id,
          status:"sprint backlog"
        })
        this.state.storyGroup.map((item, index) => {
          if (item.key == moveKeys[i]) {
            cruStoryGroup.push(item);
            item["status"]="sprint backlog"
          }
        })
        this.state.cruReleaseData["issues"].map((option, index) => {
          if (option.id == moveKeys[i]) {
            unFinishStory.push({
              key: option.id,
              issueId: option.issueId,
              issueType: option.issueType,
              description: option.description,
              status: "sprint backlog",
              subIssue:option.subIssue,
              kanbanId: option.kanbanId,
            })
          }
        })
      }
    }
    else if (direction == "left") {
      for (let i = 0; i < moveKeys.length; i++) {
        moveData.push({
          id: moveKeys[i],
          sprintId: 0,
          kanbanId: 0,
          status:"product backlog"
        })
        for (let j = 0; j < cruStoryGroup.length; j++) {
          if (cruStoryGroup[j].key == moveKeys[i]) {
            cruStoryGroup.splice(j, 1)
          }
        }
        for (let n = 0; n < this.state.storyGroup.length; n++) {
          if (this.state.storyGroup[n].key == moveKeys[i]) {
            this.state.storyGroup[n]["status"]="product backlog"
          }
        }
        for (let m = 0; m < unFinishStory.length; m++) {
          if (unFinishStory[m].key == moveKeys[i]) {
            unFinishStory.splice(m, 1)
          }
        }
      }
    }
    console.log(unFinishStory)
    SprintStore.updateIssueArr(moveData).then(data => {
      if (data) {
        console.log(moveData)
        this.setState({
          targetKeys: nextTargetKeys,
          cruStoryGroup: cruStoryGroup,
          unFinishStory: unFinishStory
        });
      }
      else {
        message.error("网络异常")
      }
    })
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    let count=this.state.selectedTargetKeysCount;
    if (targetSelectedKeys.length>count) {
      let n = targetSelectedKeys.length - 1;
      this.state.unFinishStory.map((item, index) => {
        console.log(item)
        if (targetSelectedKeys[n] == item.key) {
          if (item.subIssue.length) {
            this.setState({
              selectedTargetKeysCount:targetSelectedKeys.length,
              exitTaskVisible: true,
              tempSelectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
            })
          } else {
            this.setState({
              selectedTargetKeysCount:targetSelectedKeys.length,
              selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
          }
        }
      })
    }else{
      this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
    }
  }

  handleScroll = (direction, e) => {
  }
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  }

  // unFinishStory
  onSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys)
    this.setState({selectedRowKeys});
  }
  storyReset=()=> {
    console.log(this.state.selectedRowKeys)
    let selectData = [];
    let selectedRowKeys=this.state.selectedRowKeys;
    let unFinishStory = JSON.parse(JSON.stringify(this.state.unFinishStory));
    let targetKeys = JSON.parse(JSON.stringify(this.state.targetKeys));
    for (let i = 0; i < selectedRowKeys.length; i++) {
      selectData.push({
        id: selectedRowKeys[i],
        sprintId: 0,
        kanbanId: 0,
        status: "product backlog"
      })}
      SprintStore.updateIssueArr(selectData).then(data => {
        console.log(data)
        if (data) {
          for (let i = 0; i < selectedRowKeys.length; i++) {
            for (let j = 0; j < unFinishStory.length; j++) {
              if (unFinishStory[j].key == selectedRowKeys[i]) {
                unFinishStory.splice(j, 1)
              }
            }
            for (let m = 0; m < targetKeys.length; m++) {
              if (targetKeys[m] == selectedRowKeys[i]) {
                targetKeys.splice(m, 1)
              }
            }
            for (let n = 0; n < this.state.storyGroup.length; n++) {
              if (this.state.storyGroup[n].key == selectedRowKeys[i]) {
                this.state.storyGroup[n]["status"]="product backlog"
              }
            }
          }
          this.setState({
            selectedRowKeys: [],
            unFinishStory: unFinishStory,
            targetKeys: targetKeys,
            resetStoryVisible: false
          });
        }
        else {
          message.error("网络异常")
        }
      })
    console.log(selectData)
  }
  state = { exitTaskVisible: false ,resetStoryVisible:false}
  showModal = () => {
    this.setState({
      exitTaskVisible: true,
    });
  }
  showResetModal=()=>{
    this.setState({
      resetStoryVisible: true,
    });
  }
  handleExitTaskOk = (e) => {
    this.setState({
      exitTaskVisible: false,
      selectedKeys:this.state.tempSelectedKeys
    });
  }
  handleExitTaskCancel = (e) => {
    this.setState({
      selectedTargetKeysCount:this.state.selectedTargetKeysCount-1,
      exitTaskVisible: false,
    });
  }
  handleResetStoryOk = (e) => {
    this.storyReset();
  }
  handleResetStoryCancel = (e) => {
    this.setState({
      resetStoryVisible: false,
    });
  }
  render() {
    const selectedRowKeys=this.state.selectedRowKeys;
    const {visible, onCancel,} = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    if(this.state.mark) {
      return (
        <div>
          <Modal
            title="规划冲刺"
            bodyStyle={{minHeight: "400px",}}
            width="680px"
            visible={visible}
            onOk={onCancel}
            onCancel={onCancel}
            closable={true}
            className="sprintPlanStyle"
            footer={null}
          >
            <Modal
              title="存在task"
              visible={this.state.exitTaskVisible}
              onOk={this.handleExitTaskOk}
              onCancel={this.handleExitTaskCancel}
            >
              此用户故事已经拆分task，如果选择移入release中，拆分的task将被删除，是否继续？
            </Modal>
            <Modal
              title="重置story"
              visible={this.state.resetStoryVisible}
              onOk={this.handleResetStoryOk}
              onCancel={this.handleResetStoryCancel}
            >
              退回的用户故事状态重置为product backlog状态，所属子卡都将删除确认是否继续？
            </Modal>
            <Tabs defaultActiveKey="1" onChange={this.callback} animated={{inkBar: false, tabPane: true}}>
              <TabPane tab="用户故事" key="1">
                <div>
                  <div style={{display: "inline-block",paddingBottom: "10px",width:"300px",whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
                    <div title={this.state.cruReleaseData.name} style={{ width: '300px', whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",}}>发布计划：{this.state.cruReleaseData.name}</div>
                    <div style={{transform:"scale(0.9)",color:"#a1a1a1",transformOrigin:"left",paddingTop:"7px"}}>选择添加到冲刺的用户故事，状态将会变更为Sprint backlog</div></div>
                  <div style={{display: "inline-block",marginLeft: "47px",paddingBottom: "10px",width:"300px",whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
                    <div title={this.state.name} style={{ width: '300px', whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden",}}>冲刺：{this.state.name}</div>
                    <div style={{transform:"scale(0.9)",color:"#a1a1a1",transformOrigin:"left",paddingTop:"7px"}}>选择Sprint backlog的用户故事回到发布计划，状态被重置</div>
                  </div>
                </div>
                <Transfer
                  dataSource={this.state.storyGroup}
                  titles={[[<span style={{left:-210,position:'absolute'}}>描述</span>,<span style={{left:-50,position:'absolute'}}>状态</span>],
                  [<span style={{left:-210,position:'absolute'}}>描述</span>,<span style={{left:-50,position:'absolute'}}>状态</span>]]}
                  listStyle={{
                    width: 300,
                    height: 300,
                  }}
                  showSearch
                  filterOption={this.filterOption}
                  targetKeys={this.state.targetKeys}
                  selectedKeys={this.state.selectedKeys}
                  onChange={this.handleChange}
                  onSelectChange={this.handleSelectChange}
                  onScroll={this.handleScroll}
                  render={this.renderItem}
                />
              </TabPane>
              <TabPane tab="退回" key="2">
                <div style={{display: "inline-block", paddingBottom: "5px",width:"100%"}}>
                  <p style={{    fontSize: "16px", display: "inline-block", verticalAlign: "top"}}>未完成的用户故事</p>
                  <Button style={{marginRight:"10px",float:"right"}}type="primary" onClick={this.showResetModal}>退回</Button>
                </div>
                <div style={{transform:"scale(0.9)",color:"#a1a1a1",transformOrigin:"left",paddingBottom:"7px"}}>sprint中未完成的用户故事可以回退到release中</div>
                <div style={{width: "100%"}}>
                  <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.unFinishStory}
                         pagination={true} size="small"/>
                </div>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      );
    }else{
      return(<div></div>)
    }
  }
}
export default SprintPlanModel;
