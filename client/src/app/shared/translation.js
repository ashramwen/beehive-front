(function(win){
  win.translations = {
    "en": {
      "portalName": "Beehive Admin Portal",
      "portalNamBref": "Beehive Portal",
      "app": {
        "UNAUTHORIZED_MSG": "You are not unauthried to do so.",
        "SESSION_TIMEOUT": "User session is expired! Please login again!",
        "popover": {
          "confirmMessageTitle": "Confirm Message",
          "alertMessageTitle": "Alert Message"
        }
      },
      "terms": {
        "things": "Things",
        "id": "ID",
        "location": "Location",
        "type": "Type",
        "timePeriod": "Time Period",
        "timeLength": "Time Length",
        "mlModel": "ML Model",
        "min": "Minimun",
        "max": "Maximun",
        "avg": "Average",
        "from": "From",
        "to": "To",
        "time": "Time",
        "hour": "hour",
        "minute": "min",
        "day": "day",
        "week": "week",
        "month": "month",
        "year": "year",
        "timeInterval": "Time Interval",
        "description": "Description",
        "daily": "Daily",
        "weekday": "Weekday",
        "weekend": "Weekend",
        "enable": "Enable",
        "disable": "Disable"
      },
      "controls": {
        "refresh": "Refresh",
        "create": "Create",
        "submit": "Submit",
        "finish": "Done",
        "cancel": "Cancel",
        "save": "Save",
        "yes": "yes",
        "no": "no",
        "add": "Add",
        "delete": "Delete",
        "edit": "Edit",
        "ok": "Ok",
        "selectAll": "Select All",
        "view": "View",
        "search": "Search",
        "operate": "Operate",
        "selectedList": "Selected",
        "selectDefault": "-- Select --",
        "back": "Back"
      },
      "location": {
        "building": "Building",
        "floor": "Floor",
        "partition": "Partition",
        "area": "Area",
        "buildingBref": "B",
        "floorBref": "F",
        "partitionBref": "P",
        "areaBref": "A"
      },
      "user": {
        "hello": "hello, {{userName}}",
        "userName": "Name",
        "password": "Password",
        "loginName": "Username",
        "login": "Sign In",
        "logout": "Sign Out",
        "register": "Sign Up",
        "userLogin": "User Login",
        "activation": "Activation",
        "activateAccount": "Activate",
        "initPassword": "Initialize Password",
        "succeed": "Succeed",
        "activationCode": "Activation Code",
        "initialPassword": "Initial Password",
        "confirmPassword": "Confirm Password",
        "loginFailedMsg": "Sign In failed! Please retry!",
        "email": "Email Address",
        "phone": "Phone No.",
        "role": "Role",
        "roles": {
          "commUser": "Common User",
          "userAdmin": "User Admin",
          "administrator": "Administrator"
        }
      },
      "portalModules": {
        "welcome": {
          "displayName": "Welcome"
        },
        "userManager": {
          "displayName": "User Management",
          "userList": {
            "displayName": "Users"
          },
          "groupList": {
            "displayName": "Groups"
          },
          "newUser": {
            "displayName": "Create User"
          },
          "userDetail": {
            "displayName": "User Detail"
          },
          "editGroup": {
            "displayName": "Edit Group Detail"
          }
        },
        "thingManager": {
          "displayName": "Thing Management",
          "gatewayManagement": {
            "displayName": "Gateway Management",
          }
        },
        "thingViews": {
          "displayName": "Thing Management",
          "locationView": {
            "displayName": "Location View"
          },
          "thingDetail": {
            "displayName": "Thing Detail"
          },
          "controlThings": {
            "displayName": "Thing Control"
          },
          "typeView": {
            "displayName": "Thing Summary"
          }
        },
        "reporting": {
          "displayName": "Visual Data",
          "energyReporting": {
            "displayName": "Energy Report"
          },
          "environmentReporting": {
            "displayName": "Environment Report"
          },
          "densityReporting": {
            "displayName": "Density Report",
          },
          "customCharts": {
            "displayName": "Custom Charts"
          }
        },
        "triggerManager": {
          "displayName": "Trigger Manager",
          "triggerList": {
            "displayName": "Triggers"
          },
          "triggerDetail": {
            "displayName": "Trigger Detail"
          },
          "newTrigger": {
            "displayName": "Create Conditional Trigger"
          },
          "newScheduleTrigger": {
            "displayName": "Create Schedule Trigger"
          },
          "conditionTriggerDetail": {
            "displayName": "Conditional Trigger Detail"
          },
          "scheduleTriggerDetail": {
            "displayName": "Schedule Trigger Detail"
          },
          "machineLearningTriggerDetail": {
            "displayName": "ML Trigger Detail"
          },
          "editAction": {
            "displayName": "Edit Actions"
          },
          "editCondition": {
            "displayName": "Edit Conditions"
          }
        },
        "monitorManager": {
          "displayName": "Thing Monitoring",
          "realtime": {
            "displayName": "Real Time Monitoring"
          },
          "monitorView": {
            "displayName": "Monitoring Views",
          },
          "channelInfo": {
            "displayName": "Channel Information"
          }
        },
        "settings": {
          "displayName": "Settings"
        }
      },
      "welcome": {
        "introduction": "Welcome to use beehive portal"
      },
      "userManager": {
        "emailFormatError": "Wrong email format!",
        "phoneLength": "Phone number length not match, 11 characters is required.",
        "displayNameTooLong": "User's name is too long, 50 characters is the maximun.",
        "loginNameRequired": "Please input Login Name.",
        "loginNameTooShort": "Login Name is too short, 5 characters is the minumun.",
        "loginNameTooLong": "Login Name is too long, 20 characters is the maximun.",
        "loginNameOrEmailOrPhoneRequired": "Please input loginName, email or phone number.",
        "pattern": "Only accepts number and a-zA-Z characters.",
        "userInfoTitle": "User Information",
        "createUserBtn": "Create User",
        "editUserTitle": "Edit User Information",
        "createGroupBtn": "Create Group",
        "groupTypes": {
          "myGroups": "My Groups",
          "allGroups": "All Groups"
        },
        "createGroupTitle": "Create New Group",
        "groupName": "Group Name",
        "groupDescription": "Group Description",
        "groupEditTitle": "Edit Group",
        "groupResource": "Group Resources",
        "groupUserList": "Users",
        "createUserAlertMsg": "New user's ID is {{userID}}, Activation Code is: {{activityToken}}. Please go to Login Page and activate the account!",
        "userNameConflictMsg": "Username, mobile number or Email existing! Please retry!",
        "deleteUserGroupMsg": "Sure to delete Group[{{userGroupName}}]?"
      },
      "thing": {
        "onboardingStatus": "Onboarded",
        "thingList": "Things",
        "state": "State",
        "action": "Action",
        "sendCommand": "Send Command"
      },
      "thingManager": {
        "commandSentMsg": "Command has been sent!",
        "gatewayAddedMsg": "Gateway has been created!",
        "gatewayList": "Gateways",
        "createGateway": "Create Gateway",
        "gatewayIDToolTip": "Please input a 3-figure gateway ID.",
        "selectLocationToolTip": "Please select a location.",
        "thingSelect": "Select Things"
      },
      "thingViews": {
        "thingNumber": "Thing Number",
        "thingsRequired": "Please select at least one devices.",
        "actionRequired": "Please select at least one action."
      },
      "reporting": {
        "removeCustomChartMsg": "Sure to remove chart?",
        "createChartTitle": "Create Chart",
        "editChartTitle": "Edit Chart",
        "indexType": "Index Type",
        "densityRatio": "Density Ratio",
        "density": "Density",
        "merge": "Merge",
        "split": "Split",
        "aggMethod": "Aggregation",
        "totalEnergyConsumption": "Total Energy Consumption",
        "energyConsumption": "Energy Consumption",
        "eachLocation": "Each Location",
        "trend": "Trend",
        "current": "Current",
        "CO2": "CO2",
        "Temp": 'Temperature',
        "Noise": "Noise",
        "Bri": "Brightness",
        "PM25": "PM2.5",
        "Humidity": "Humidity",
        "VOC": "VOC",
        "Smoke": "Smoke",
        "chartName": "Chart Name",
        "chartType": "Chart Type",
        "thingType": "Thing Type",
        "yAxis": "Y-Axis",
        "dimensions": "Dimensions",
        "defaultLocation": "Default Location",
        "addLocation": "Add Location",
        "barChart": "Bar Chart",
        "pieChart": "Pie Chart",
        "lineChart": "Line Chart",
        "createChart": "Create Chart"
      },
      "triggerManager": {
        "triggerCreatedMsg": "Rule has been created!",
        "triggerSavedMsg": "Rule hass been saved!",
        "deleteTriggerMsg": "Sure to Delete this trigger?",
        "enableTriggerMsg": "Sure to enable this trigger?",
        "disableTriggerMsg": "Sure to disabled this trigger?",
        "ruleActions": "Rule Actions",
        "addParam": "Add Parameter",
        "requireActionMsg": "At least one action is required",
        "ruleConditions": "Rule Conditions",
        "addCondition": "Add Condition",
        "requireConditionMsg": "At least one condtion is required",
        "ruleInfo": "Rule Information",
        "ruleName": "Rule Name",
        "status": "Status",
        "requireRuleNameMsg": "Rule Name is Required",
        "timeSetting": "Time Setting",
        "onTime": "Once",
        "repeat": "Repeat",
        "standard": "Standard",
        "hourly": "Hourly",
        "interval": "Interval",
        "requireTimeMsg": "Time is required",
        "requireIntervalMsg": "Time Interval is required",
        "requireTimeUnitMsg": "Time Unit is required!",
        "thingSelect": "Select Things",
        "conditionRule": "Conditional Rule",
        "scheduleRule": "Schedule Rule",
        "machineLearningRule": "ML Rule",
        "view": "View",
        "displayDisabled": "Show Disabled",
        "gatewayRuleTip": "This is a gateway rule",
        "any": "Any",
        "all": "All"
      },
      "monitorManager": {
        "deleteChannelMsg": "Sure to delete this Channel?",
      },
      "settings": {
        "passwordNotMatch": "Two password doesn't match, pleas retry!",
        "changePasswordSuccessMsg": "Password has been modified successfully!",
        "changePasswordErrorMsg": "Password modification failed! Please try again!",
        "changePassword": "Change Password",
        "newPassword": "New Password",
        "oldPassword": "Old Password",
        "confirmPassword": "Input Your Password Again"
      }
    },
    "cn": {
      "portalName": "蜂巢智能管理平台",
      "portalNamBref": "蜂巢平台",
      "app": {
        "UNAUTHORIZED_MSG": "您没有相应的操作权限。",
        "SESSION_TIMEOUT": "用户登录口令过期，请重新登陆！",
        "popover": {
          "confirmMessageTitle": "确认信息",
          "alertMessageTitle": "提示信息"
        }
      },
      "terms": {
        "things": "设备",
        "id": "ID",
        "location": "位置",
        "type": "种类",
        "timePeriod": "时间段",
        "timeLength": "单位时长",
        "mlModel": "机器学习模型",
        "min": "最小值",
        "max": "最大值",
        "avg": "平均值",
        "from": "从",
        "to": "至",
        "time": "时间",
        "hour": "小时",
        "minute": "分钟",
        "day": "天",
        "week": "周",
        "month": "月",
        "year": "年",
        "daily": "每天",
        "weekday": "周一至周五",
        "weekend": "周末",
        "timeInterval": "时间间隔",
        "description": "描述",
        "enable": "启用",
        "disable": "禁用"
      },
      "controls": {
        "refresh": "刷新",
        "create": "创建",
        "submit": "提交",
        "finish": "完成",
        "cancel": "取消",
        "yes": "是",
        "no": "否",
        "add": "添加",
        "delete": "删除",
        "edit": "编辑",
        "ok": "确定",
        "selectAll": "全选",
        "view": "查看",
        "search": "搜索",
        "operate": "操作",
        "selectedList": "已选列表",
        "selectDefault": "请选择",
        "save": "保存",
        "back": "返回"
      },
      "location": {
        "building": "楼号",
        "floor": "层号",
        "partition": "区域",
        "area": "区块",
        "buildingBref": "楼",
        "floorBref": "层",
        "partitionBref": "区域",
        "areaBref": "区块"
      },
      "user": {
        "hello": "您好，{{userName}}",
        "userName": '姓名',
        "password": "密码",
        "loginName": "登录名",
        "login": "登录",
        "logout": "用户登出",
        "register": "注册",
        "userLogin": "用户登录",
        "activation": "用户激活",
        "activateAccount": "激活账号",
        "initPassword": "初始化密码",
        "succeed": "激活成功",
        "activationCode": "激活码",
        "initialPassword": "初始密码",
        "confirmPassword": "确认密码",
        "loginFailedMsg": "登录失败",
        "email": "电子邮箱",
        "phone": "电话号码",
        "role": "角色",
        "roles": {
          "commUser": "普通用户",
          "userAdmin": "用户管理员",
          "administrator": "系统管理员"
        }
      },
      "portalModules": {
        "welcome": {
          "displayName": "欢迎",
        },
        "userManager": {
          "displayName": "用户管理",
          "userList": {
            "displayName": "用户列表"
          },
          "groupList": {
            "displayName": "群组列表"
          },
          "newUser": {
            "displayName": "新建用户"
          },
          "userDetail": {
            "displayName": "用户详情"
          },
          "editGroup": {
            "displayName": "编辑群组"
          }
        },
        "thingManager": {
          "displayName": "设备管理",
          "gatewayManagement": {
            "displayName": "网关管理",
          }
        },
        "thingViews": {
          "displayName": "设备管理",
          "locationView": {
            "displayName": "位置视图"
          },
          "thingDetail": {
            "displayName": "设备详情"
          },
          "typeView": {
            "displayName": "设备概览"
          },
          "controlThings": {
            "displayName": "设备控制"
          }
        },
        "reporting": {
          "displayName": "数据报表",
          "energyReporting": {
            "displayName": "能耗报表"
          },
          "environmentReporting": {
            "displayName": "环境报表"
          },
          "densityReporting": {
            "displayName": "人流密度",
          },
          "customCharts": {
            "displayName": "自定义图表"
          }
        },
        "triggerManager": {
          "displayName": "规则管理",
          "triggerList": {
            "displayName": "规则列表"
          },
          "triggerDetail": {
            "displayName": "规则详情"
          },
          "newTrigger": {
            "displayName": "新建条件规则"
          },
          "newScheduleTrigger": {
            "displayName": "新建定时规则"
          },
          "conditionTriggerDetail": {
            "displayName": "条件规则详情"
          },
          "scheduleTriggerDetail": {
            "displayName": "定时规则详情"
          },
          "machineLearningTriggerDetail": {
            "displayName": "机器学习规则详情"
          },
          "editAction": {
            "displayName": "编辑行为"
          },
          "editCondition": {
            "displayName": "编辑条件"
          }
        },
        "monitorManager": {
          "displayName": "设备监控",
          "realtime": {
            "displayName": "实时监控"
          },
          "monitorView": {
            "displayName": "监控视图",
          },
          "channelInfo": {
            "displayName": "频道信息"
          }
        },
        "settings": {
          "displayName": "设置"
        }
      },
      "welcome": {
        "introduction": " 欢迎使用蜂巢智能管理平台"
      },
      "userManager": {
        "emailFormatError": "邮箱地址格式错误！",
        "phoneLength": "手机号码长度必须为11位。",
        "displayNameTooLong": "用户姓名不得超过50个字符",
        "loginNameRequired": "请输入登录名",
        "loginNameTooShort": "登录名不能少于5个字符。",
        "loginNameTooLong": "登录名不能多于20个字符。",
        "loginNameOrEmailOrPhoneRequired": "请输入登录名，邮箱地址或手机号码。",
        "pattern": "只允许输入数字或者英文字母",
        "userInfoTitle": "用户信息",
        "createUserBtn": "新建用户",
        "editUserTitle": "编辑用户资料",
        "createGroupBtn": "创建群组",
        "groupTypes": {
          "myGroups": "我的群组",
          "allGroups": "所有群组"
        },
        "createGroupTitle": "创建群组",
        "groupName": "群组名称",
        "groupDescription": "群组描述",
        "groupEditTitle": "编辑群组",
        "groupResource": "群组资源",
        "groupUserList": "用户列表",
        "createUserAlertMsg": "新创建的用户ID为：{{userID}},激活码为：{{activityToken}}。请前往登录页面进行激活。",
        "userNameConflictMsg": "用户名，手机号码，或邮箱已存在，请重新尝试。",
        "deleteUserGroupMsg": "确定要删除用户群组[{{userGroupName}}]吗?",
        "createNewGroupFailedMsg": "新增群组失败！"
      },
      "thing": {
        "onboardingStatus": "登录状态",
        "thingList": "设备列表",
        "state": "状态",
        "action": "行为",
        "sendCommand": "发送命令"
      },
      "thingManager": {
        "commandSentMsg": "命令已发送成功",
        "gatewayAddedMsg": "网关添加成功！",
        "gatewayList": "网关列表",
        "createGateway": "创建网关",
        "gatewayIDToolTip": "输入3位数字设备编号",
        "selectLocationToolTip": "请选择一个位置",
        "thingSelect": "设备选择"
      },
      "thingViews": {
        "thingNumber": "设备数量",
        "thingsRequired": "请至少选择一个设备",
        "actionRequired": "请选择至少一个行为"
      },
      "reporting": {
        "removeCustomChartMsg": "是否移除图表?",
        "createChartTitle": "创建图表",
        "editChartTitle": "编辑图表",
        "indexType": "指数类型",
        "densityRatio": "人气值比例",
        "density": "人气值",
        "merge": "合并",
        "split": "拆分",
        "aggMethod": "聚合方法",
        "totalEnergyConsumption": "耗电总量",
        "energyConsumption": "电量消耗",
        "eachLocation": "各位置",
        "trend": "趋势",
        "current": "当前",
        "CO2": "二氧化碳",
        "Temp": '温度',
        "Noise": "噪音指数",
        "Bri": "亮度",
        "PM25": "PM2.5",
        "Humidity": "湿度",
        "VOC": "空气质量",
        "Smoke": "烟尘",
        "chartName": "图表名称",
        "chartType": "图表种类",
        "thingType": "设备种类",
        "yAxis": "Y轴",
        "dimensions": "维度",
        "defaultLocation": "默认地址",
        "addLocation": "添加地址",
        "barChart": "柱状图",
        "pieChart": "饼图",
        "lineChart": "折线图",
        "createChart": "创建图表"
      },
      "triggerManager": {
        "triggerCreatedMsg": "规则创建成功！",
        "triggerSavedMsg": "规则保存成功！",
        "deleteTriggerMsg": "您确定要删除这个规则吗？",
        "enableTriggerMsg": "您确定要启用这个规则吗？",
        "disableTriggerMsg": "您确定要禁用这个规则吗？",
        "ruleActions": "规则行为",
        "addParam": "添加参数",
        "requireActionMsg": "至少需要添加一个行为",
        "ruleConditions": "规则条件",
        "addCondition": "添加条件",
        "requireConditionMsg": "至少需要添加一个条件",
        "ruleInfo": "规则详情",
        "ruleName": "规则名称",
        "status": "启用状态",
        "requireRuleNameMsg": "请输入规则名称",
        "timeSetting": "时间设置",
        "onTime": "准点准时",
        "repeat": "阶段重复",
        "standard": "标准定时",
        "hourly": "每小时",
        "interval": "间隔时间",
        "requireTimeMsg": "请输入正确的触发时间",
        "requireIntervalMsg": "请输入正确的触发间隔",
        "requireTimeUnitMsg": "请选择时间单位",
        "thingSelect": "设备选择",
        "conditionRule": "条件规则",
        "scheduleRule": "时间规则",
        "machineLearningRule": "机器学习",
        "view": "视图",
        "displayDisabled": "显示禁用",
        "gatewayRuleTip": "这是一个网管端的规则。",
        "any": "任何一个",
        "all": "全部"
      },
      "monitorManager": {
        "deleteChannelMsg": "是否删除频道？",
      },
      "settings": {
        "passwordNotMatch": "新密码与输入的确认密码不一致，请重新输入！",
        "changePasswordSuccessMsg": "更改密码成功！",
        "changePasswordErrorMsg": "更改密码失败！",
        "changePassword": "更改密码",
        "newPassword": "新密码",
        "oldPassword": "旧密码",
        "confirmPassword": "再次输入密码"
      }
    }
  }
})(window);





