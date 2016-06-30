angular.module('BeehivePortal.ScenarioManager.OfficeAtmosphere')
  .directive('devicePanel', ['$templateCache', '$compile', '$mdpTimePicker', '$timeout', function($templateCache, $compile, $mdpTimePicker, $timeout){
    return {
      restrict: 'A',
      scope: {
        panel: '=?',
        output: '=?',
        input: '=?'
      },
      link: function(scope, $ele, $attr){
        var $tip;
        var popoverTemplate = $templateCache.get('oaMctrl.template.html');

        scope.selectedDateType = scope.dateTypeOptions[0];

        scope.outputData = {

        };

        scope.cancelOnClick = function(){
          destroyPopover();
        };

        scope.saveOnClick = function(){
          destroyPopover();
        };

        function destroyPopover(){
          $ele.popover('hide');
          $ele.popover('destroy');
          $('body').unbind('click', hidePopover);
        }

        $ele.click(function(){
          var placement = $ele.offset().top - scope.panel.offset().top < 200? 'bottom': 'top';

          $ele.popover({
            container: scope.panel.selector,
            placement: placement,
            trigger: 'none',
            template: popoverTemplate,
            viewport: scope.panel,
            content: 'aaa'
          });

          $tip = $ele.popover('show').data('bs.popover').$tip;
          $tip = $($tip);
          $compile($tip.find('.body-content'))(scope);

          $timeout(function(){
            $('body').on('click', hidePopover);
          })
        });

        function hidePopover(e){
          var parentPopover = $(e.target).parents('.popover')[0];
          var timePicker = $(e.target).parents('md-dialog')
          if(parentPopover != $tip[0] && timePicker.length == 0){
            destroyPopover();
          }
        }
      }
    };
}]);