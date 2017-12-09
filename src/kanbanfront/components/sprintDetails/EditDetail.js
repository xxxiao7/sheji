/**
 * Created by chenzl on 2017/10/12.
 * feature:编辑/查看story详情
 */
/*eslint-disable*/
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  Select,
  Button,
  InputNumber,
  Input,
  message,
  Tag,
  Tabs,
  Icon,
} from 'antd';

import SprintStore from '../../stores/origanization/sprint/SprintStore';

const Option = Select.Option;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
//定义状态卡片颜色
const types = {
  'product backlog': '#108EE9',
  'sprint backlog': '#0C60AA',
  'pre todo': '#523EB3',
  todo: '#FF8040',
  doing: '#F2B43E',
  done: '#00A854',
};
const styles = {
  items: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  item: {
    width: '65px',
  },
  itemContent: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  select: {
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};
const size = 'small';
@observer
class EditDetail extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      topshow: false,
    };
  }

  //textarea的enter事件
  ChangeIssue = (e, type) => {
    let data = {};
    let va = e.target.value;
    data[type] = va;
    SprintStore.setCurrentEditData(data);
    SprintStore.updateIssueById(SprintStore.currentId, data)
      .then(data => {
        this.props.init();
        if (data) {
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      })
      .catch(error => {
        console.log(error);
      });
    //在这之下调用后端更改接口
  };
  //拿到textarea
  getTextArea = (instance, type) => {
    if (instance) {
      this[type] = instance;
      // console.log(this[type]);
    }
  };
  //当数据存在store里时，可以根据store数据来动态更改textarea里的值
  componentWillReact() {
    this.changeTextArea('description', SprintStore.currentEditData.description);
    this.changeTextArea('content', SprintStore.currentEditData.content);
  }
  //更改本地textarea内容
  changeTextArea(type, value) {
    ReactDOM.findDOMNode(this[type]).value = value;
  }
  //所有select的响应函数
  onSelectChange = (value, obj) => {
    console.log(value, obj);
    let va;
    va = typeof value === 'object' ? value.label : value;
    let data = {};
    data[obj.type] = va;
    console.log(data);
    SprintStore.setCurrentEditData(data);
    SprintStore.updateIssueById(SprintStore.currentId, data)
      .then(data => {
        this.props.init();
        if (data) {
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  // saveRef(instance, type) {
  //   if (instance) {
  //     this[type] = instance;
  //     ReactDOM.findDOMNode(this[type]).value = '2';
  //     console.log(this[type]);
  //   }
  // }
  render() {
    // console.log({ ...currentEditData });
    const currentEditData = SprintStore.getCurrentEditData;
    const sprintData = SprintStore.getSprintData;
    const sprintName = sprintData['name'];
    console.log({ ...currentEditData });
    return (
      //总容器
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 500,
          width: '440px',
          background: 'white',
          borderLeft: '1px solid #ddd',
          height: 'calc(100% - 48px)',
          display: 'flex',
          flexDirection: 'column',
        }}
        id="editstory"
      >
        {/* 侧边栏的header */}
        <div
          style={{
            padding: '10px 10px',
            height: '57px',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ddd',
          }}
        >
          <span style={{ margin: '0 0 0 10px' }}>
            #{currentEditData.issueId}
          </span>
          <span
            style={{
              margin: '0 0 0 10px',
            }}
          >
            [{currentEditData.issueType}]
          </span>
          <span style={{ margin: '0 0 0 10px' }}>基本信息</span>
          <span
            style={{
              color: '#3f51b5',
              fontSize: '13px',
              marginLeft: '114px',
              cursor: 'pointer',
            }}
            onClick={this.props.hideRight}
          >
            隐藏信息面板
          </span>
        </div>
        {/* header下面的tab页 */}
        <Tabs style={{ flex: 1 }}>
          {/* 第一个tab页 */}
          <TabPane
            tab={<span style={{ fontSize: '12px' }}>基本信息</span>}
            key="1"
          >
            <div
              style={{
                margin: '0 24px 10px 24px',
                height: '100%',
                marginBottom: '100px',
              }}
            >
              <div>描述</div>
              <TextArea
                style={{
                  resize: 'none',
                  borderRadius: 0,
                }}
                ref={instance => {
                  this.getTextArea(instance, 'description');
                }}
                placeholder="请输入描述"
                defaultValue={currentEditData.description}
                autosize={{ minRows: 3, maxRows: 10 }}
                onFocus={() => {
                  this.setState({ topshow: true });
                }}
                onBlur={e => {
                  this.ChangeIssue(e, 'description');
                }}
              />
              <div style={{ marginTop: '10px' }}>内容</div>
              <TextArea
                style={{
                  resize: 'none',
                  borderRadius: 0,
                }}
                ref={instance => {
                  this.getTextArea(instance, 'content');
                }}
                placeholder="请输入详细描述"
                defaultValue={currentEditData.content}
                autosize={{ minRows: 3, maxRows: 10 }}
                onFocus={() => {
                  this.setState({ show: true });
                }}
                onBlur={e => {
                  this.ChangeIssue(e, 'content');
                }}
              />
              {/* 下面信息展示以及修改区域容器 */}
              <div
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '2px 21px 10px 21px',
                  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.20)',
                }}
              >
                <div style={styles.items}>
                  <div style={styles.item}>状态：</div>
                  <div style={styles.itemContent}>
                    <span
                      style={{
                        padding: '2px 5px',
                        color: 'white',
                        borderRadius: '8px',
                        background: types[currentEditData.status],
                      }}
                    >
                      {currentEditData.status}
                    </span>
                  </div>
                </div>
                <div style={styles.items}>
                  <div style={styles.item}>父级需求：</div>
                  <div
                    style={styles.itemContent}
                    title={SprintStore.parentName}
                  >
                    {'#' + currentEditData.parentId + ' '}
                    {SprintStore.parentName}
                  </div>
                </div>
                <div style={styles.items}>
                  <div style={styles.item}>负责人：</div>
                  <div style={styles.itemContent}>{'-'}</div>
                </div>
                <div style={styles.items}>
                  <div style={styles.item}>冲刺：</div>
                  <div
                    style={styles.itemContent}
                    title={
                      currentEditData.sprintName == null
                        ? '-'
                        : currentEditData.sprintName
                    }
                  >
                    {currentEditData.sprintName == null
                      ? '-'
                      : currentEditData.sprintName}
                  </div>
                </div>

                <div style={styles.items}>
                  <div style={styles.item}>看板：</div>
                  <div
                    style={styles.itemContent}
                    title={
                      currentEditData.kanbanName == null
                        ? '-'
                        : currentEditData.kanbanName
                    }
                  >
                    {currentEditData.kanbanName == null
                      ? '-'
                      : currentEditData.kanbanName}
                  </div>
                </div>
                
                <div style={{ marginTop: '15px' }}>
                  {SprintStore.taskType ? '工作量：' : '故事点：'}
                </div>
                <div style={{ ...styles.select, ...{ paddingRight: '12px' } }}>
                  <InputNumber
                    min={1}
                    size={size}
                    style={{
                      ...styles.select,
                      ...{ borderRadius: 0, height: '27px' },
                    }}
                    value={
                      SprintStore.taskType
                        ? currentEditData.workload
                        : currentEditData.storyPoint
                    }
                    //数据更改事件
                    onChange={value => {
                      this.onSelectChange(value, {
                        type: SprintStore.taskType ? 'workload' : 'storyPoint',
                      });
                    }}
                  />
                </div>
                <div style={{ marginTop: '15px' }}>优先级</div>
                <Select
                  getPopupContainer={() => document.getElementById('editstory')}
                  size={size}
                  style={styles.select}
                  value={
                    currentEditData.issuePriority != null
                      ? currentEditData.issuePriority
                      : '1'
                  }
                  onChange={value => {
                    this.onSelectChange(value, {
                      type: 'issuePriority',
                    });
                  }}
                >
                  <Option value="1">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          background: '#5095fe',
                        }}
                      />
                      低
                    </div>
                  </Option>
                  <Option value="2">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          background: '#f9d252',
                        }}
                      />
                      中
                    </div>
                  </Option>
                  <Option value="3">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          background: '#fe5050',
                        }}
                      />
                      高
                    </div>
                  </Option>
                </Select>
                {!SprintStore.taskType && (
                  <div>
                    <div style={{ marginTop: '4px' }}>需求来源</div>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      size={size}
                      style={styles.select}
                      labelInValue
                      value={{
                        label:
                          currentEditData.demandSource != null
                            ? currentEditData.demandSource
                            : '客户',
                      }}
                      onChange={value => {
                        this.onSelectChange(value, {
                          type: 'demandSource',
                        });
                      }}
                    >
                      <Option value="1">客户</Option>
                      <Option value="2">用户</Option>
                      <Option value="3">产品经理</Option>
                      <Option value="4">市场</Option>
                      <Option value="5">客服</Option>
                      <Option value="6">竞争对手</Option>
                      <Option value="7">开发人员</Option>
                      <Option value="8">测试人员</Option>
                      <Option value="9">bug</Option>
                      <Option value="10">其他</Option>
                    </Select>

                    <div style={{ marginTop: '4px' }}>需求类型</div>
                    <Select
                      getPopupContainer={() =>
                        document.getElementById('editstory')
                      }
                      size={size}
                      style={styles.select}
                      labelInValue
                      value={{
                        label:
                          currentEditData.demandType != null
                            ? currentEditData.demandType
                            : '新需求',
                      }}
                      onChange={value => {
                        this.onSelectChange(value, { type: 'demandType' });
                      }}
                    >
                      <Option value="1">新需求</Option>
                      <Option value="2">变更</Option>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </TabPane>
          {/* 第二个tab页 */}
          <TabPane
            disabled="true"
            tab={<span style={{ fontSize: '12px' }}>评论</span>}
            key="2"
          >
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
          </TabPane>
          {/* 第三个tab页 */}
          <TabPane
            disabled="true"
            tab={<span style={{ fontSize: '12px' }}>操作记录</span>}
            key="3"
          >
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default withRouter(EditDetail);
