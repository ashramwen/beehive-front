angular.module('BeehivePortal')
  .factory('ThingErrorHandler', ['ERROR_CODE', 'AppUtils', function(ERROR_CODE, AppUtils){
    return {
      handle: function(error, func){
        var message = '';
        switch(error){
          case ERROR_CODE.INVALID_INPUT:
            message = '检测到非法输入！请重新输入！此处只允许输入50位以内的数字或字符或下划线(_)。';
            break;
          default:
            message = '未知错误，请联系平台呢管理员！';
            break;
        }

        AppUtils.alert(message, '提示信息', func);
      }
    };
  }]);