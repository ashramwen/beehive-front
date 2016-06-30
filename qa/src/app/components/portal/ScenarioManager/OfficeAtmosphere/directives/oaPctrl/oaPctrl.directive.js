angular.module('BeehivePortal.ScenarioManager.OfficeAtmosphere')
  .directive('oaPctrl', ['$templateCache', '$compile', '$timeout', function($templateCache, $compile, $timeout){
    return {
      restrict: 'A',
      scope: {
        panel: '=?',
        output: '=?',
        input: '=?'
      },
      link: function(scope, $ele, $attr){
        var $tip;
        var popoverTemplate = $templateCache.get('oaPctrl.template.html');

        scope.outputData = {result: null};

        scope.cancelOnClick = function(){
          destroyPopover();
        };

        scope.saveOnClick = function(){
          if(scope.output){
            scope.output(scope.outputData.result);
          }
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
          var $dropdowns = $(e.target).parents('.dropdown-menu');
          var $modals = $(e.target).parents('.modal');
          if(parentPopover != $tip[0] && $dropdowns.length == 0 && $modals.length == 0){
            destroyPopover();
          }
        }
      } 
    };
  }]);