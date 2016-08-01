angular.module('BeehivePortal.MonitorManager', ['ui.router'])

.constant('ThingType', {
    'AirCondition': {
        'Power': '电源',
        'Speed': '风速',
        'Mode': '运行模式',
        'Temp': '温度',
        'OPHours': '运行时常(小时)',
        'ConStates': '连接状态'
    }
})