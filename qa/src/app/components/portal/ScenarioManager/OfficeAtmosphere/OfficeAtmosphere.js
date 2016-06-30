angular.module('BeehivePortal.ScenarioManager.OfficeAtmosphere', ['mdPickers']).run(function($templateCache, $http, $mdpTimePicker){
  $http.get('app/components/portal/ScenarioManager/OfficeAtmosphere/directives/oaMctrl/oaMctrl.template.html').then(function(response){
    $templateCache.put('oaMctrl.template.html', response.data);
  });

  $http.get('app/components/portal/ScenarioManager/OfficeAtmosphere/directives/oaPctrl/oaPctrl.template.html').then(function(response){
    $templateCache.put('oaPctrl.template.html', response.data);
  });
});