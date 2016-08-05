angular.module('BeehivePortal.MonitorManager')

.constant('ThingType', {
    'AirCondition': '空调',
    'FreshAir': '新风',
    'EnvironmentSensor': '环境传感器',
    'Lighting': '照明',
    'ElectricMeter': '智能电表',
    'AirCleaner': '空气净化器'
})

.constant('StateType', {
    'AFStates': '滤网状态',
    'AirQuality': '空气质量',
    'Bri': '亮度',
    'ColTemp': '色温',
    'Col': '颜色',
    'ConStates': '连接状态',
    'Inverter': '变频频率',
    'FeedBack': '变频反馈',
    'Mode': '运行模式',
    'OPStates': '运行状态',
    'OPHours': '运行时长',
    'Power': '电源',
    'Speed': '风速',
    'Temp': '温度'
});