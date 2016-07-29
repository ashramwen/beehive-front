'use strict';

angular.module('BeehivePortal')
  .directive('kiiChart', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: false,
        scope:{
            query: '=?',
            period: '=?',
            window: '=?',
            location: '=?',
            refresh: '=?',
            refreshWhenReady: '=?',
            level: '=?',
            stage: '=?',
            chart: '@',
            output: '=?'
        },
        link: function($scope, ele, attr){

            ele.css({display: 'block'});
            $scope._chart = null;
            $scope._kiiQuery = null;
            $scope._subscribed = false;
            $scope._perviousQuery = null;

            $scope.$watch('query', function(newVal){
                if(!newVal) return;
                if(!$scope.refreshWhenReady) return;
                $scope.refresh();
            });
            $scope.$watch('refreshWhenReady', function(){
                if(!$scope.query) return;
                $scope.refresh();
            });

            $scope.refresh = function(){
                if(!$scope.period || !$scope.query) return;
                if($scope._perviousQuery != $scope.query){
                    var _query = $scope.query;
                    if(!_.isString($scope.query)){
                        _query = JSON.stringify(_query);
                    }

                    $scope._kiiQuery = new KiiReporting.KiiQuery(_query);
                    $scope._subscribed = false;
                    if($scope._chart){
                        $scope._chart.destroy();
                        $scope._chart = null;
                    }
                }
                
                if(!$scope._kiiPeriod){
                    $scope._kiiPeriod = new KiiReporting.KiiTimePeriod(null);
                }
                $scope._kiiQuery.setTimePeriod($scope._kiiPeriod);


                $scope._kiiPeriod.setUnit($scope.period.unit);
                $scope._kiiPeriod.setInterval($scope.period.interval);
                $scope._kiiPeriod.setFromTime(new Date($scope.period.fromTime));
                $scope._kiiPeriod.setToTime(new Date($scope.period.toTime));

                if($scope.window){
                    var time = 1;
                    var fromTime =  new Date($scope.period.fromTime);
                    switch($scope.period.unit){
                        case 'm':
                            fromTime.setMinutes(fromTime.getMinutes() - $scope.window);
                            break;
                        case 'H':
                            fromTime.setHours(fromTime.getHours() - $scope.window);
                            break;
                        case 'd':
                            fromTime.setDays(fromTime.getDays() - $scope.window);
                            break;
                        case 'w':
                            fromTime.setTime(fromTime.getTime() - 7 * 24 * 60 * 60 * 1000 * $scope.window);
                            break;
                        case 'M':
                            fromTime.setMonth(fromTime.getMonth() - $scope.window);
                            break;
                    }
                    $scope._kiiPeriod.setFromTime(fromTime);
                }
                $scope._kiiQuery.query();

                if($scope._kiiQuery && ! $scope._subscribed){
                    $scope._kiiQuery.subscribe(onMessageReceived);
                    $scope._subscribed = true;
                }
            };

            function onMessageReceived(response){
                var aggTree = $scope._kiiQuery.getAggTree();
                var data = response.data;
                if($scope.window){
                    var aggTree = JSON.stringify(aggTree);
                    aggTree = JSON.parse(aggTree);
                    var index = $scope.window;
                    while(index--){
                        if(!aggTree.keySet[0]) break;
                        delete data[aggTree.fieldName][aggTree.keySet.shift()];
                    }
                }
                if($scope.stage){
                    if(aggTree.keySet.length == 0) return;
                    data = data[aggTree.fieldName][aggTree.keySet[0]];
                    aggTree = aggTree.children[0];
                }
                if($scope.output){
                    $scope.output(response);
                }
                refreshGraph(aggTree, data);
            }

            function refreshGraph(aggTree, data){
                var selectedAgg = aggTree;
                var i = $scope.level;

                aggTree.chart = $scope.chart || aggTree.chart;

                while(i--){
                    selectedAgg = selectedAgg.children[0];
                }

                if(!$scope._chart){
                    $scope._chart = KiiReporting.KiiChart.createChart(
                        aggTree, 
                        selectedAgg, 
                        ele, 
                        {}
                    );
                }

                if(!$scope._chart) return;
                $scope._chart.updateAggTree(aggTree);
                $scope._chart.selectAggNode(selectedAgg);
                $scope._chart.setData(data);
                $scope._chart.refresh();
            }
        }
    };
  }]);