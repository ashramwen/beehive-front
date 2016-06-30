angular.module('BeehivePortal.ScenarioManager.OfficeAtmosphere').factory('TriggerPanelService', ['$rootScope', '$timeout', '$$Thing', '$templateCache', 'AppUtils', '$cacheFactory', function ($rootScope, $timeout, $$Thing, $templateCache, AppUtils, $cacheFactory) {
  var TriggerPanelService = {};


  TriggerPanelService.factory = function($panel, $scope){
    return new PanelControl($panel, $scope);
  };

  function PanelControl($panel, $scope){

    this.$cache = $cacheFactory('OfficeAtmosphere');

    this._$panel = $panel;
    this.$scope = $scope;
    this._$rightPanel = $panel.find('.right-panel');
    this._$leftPanel = $panel.find('.left-panel');
    this._$locationPanel = this._$leftPanel.find('.item-container');
    this._$controllerPanel = this._$leftPanel.find('.controller-container');

    /**
     * tool panel
     * @type {[type]}
     */
    this._$toolPanel = $panel.find('.tool-panel');
    this._$toolPanel._subControls = {
      trash: this._$toolPanel.find('.trash')
    };

    this._$cols = this._$rightPanel.find('.col');
    this.locationLink = [];

    this.dataContainer = {
      sensors: [],
      locations: [],
      equipments: [],
      locationTree: {},
      popedSensors: [],
      popedEquipments: [],
      mainController: null
    };

    this.triggerControllerTypes = [{
        icon: 'fa fa-clock-o',
        type: PanelControl.ControllerType.TIMER
      },{
        icon: 'fa fa-user',
        type: PanelControl.ControllerType.CONDITION
      }
    ];

    this._$rightPanel.cols = {
      sensors: this._$rightPanel.find('.col.col-1'),
      locations: this._$rightPanel.find('.col.col-2'),
      mainController: this._$rightPanel.find('.col.col-3'),
      subController: this._$rightPanel.find('.col.col-4'),
      equipments: this._$rightPanel.find('.col.col-5')
    };

    /**
     * init bg graph and canvas
     */
    this.graph = d3.select('#graph');
    this.lineGroup = [];

    this.$scope.dataContainer = this.dataContainer;

    this.init();
  }


  PanelControl.PopoverSensorTemplate = $templateCache.get('office-atmosphere.popover-sensor.template.html');
  PanelControl.PopoverEquipTemplate = $templateCache.get('office-atmosphere.popover-equip.template.html');

  PanelControl.DataTypes = {
    LOCATION: 'location',
    SENSOR: 'sensor',
    EQUIPMENT: 'equipment',
    CONTROLLER: 'controller',
    MAIN_CONTROLLER: 'main_controller',
    SUB_CONTROLLER: 'sub_controller'
  };

  /**
   * type of controller, could be timer or conditional
   * @type {Object}
   */
  PanelControl.ControllerType = {
    TIMER: 'timer',
    CONDITION: 'condition'
  };

  /**
   * panel events constants
   * @type {Object}
   */
  PanelControl.Events = {
    ITEM_START_DRAG: 'item-start-drag',
    ITEM_STOP_DRAG: 'item-stop-drag',
    ITEM_START_DELETE: 'item-start-delete',
    ITEM_STOP_DELETE: 'item-stop-delete',
    ITEM_DESTROYED: 'item_destroyed',
    ITEM_ADDED: 'item_added'
  };

  PanelControl.DragActions = {
    DRAGGIN_LOCATION: 'DRAGGIN_LOCATION',
    DRAGGIN_SENSOR: 'DRAGGIN_SENSOR',
    DRAGGIN_EQUIP: 'DRAGGIN_EQUIP',
    DRAGGIN_CONTROLLER: 'DRAGGIN_CONTROLLER'
  };

  PanelControl.prototype.init = function(){
    var _self = this;

    /**
     * redraw when window is resized;
     */
    
    function redrawBinder() {
      _self.redraw.call(_self);
    }
    $(window).on('resize', redrawBinder);
    this.redrawBinder = redrawBinder;

    this._$toolPanel._subControls.trash.droppable({
      accept: ".draggable-item",
      hoverClass: 'active',
      over: function(){
        _self._$toolPanel._subControls.trash.addClass('active');
      },
      out: function(){
        _self._$toolPanel._subControls.trash.removeClass('active');
      },
      drop: function(){
        _self.onDropDelete.apply(_self, arguments);
      } 
    });

    this.$scope.locationOnClick = function(location, $event){
      _self.loadSensors.call(_self, location, $event);
    };

    this.$scope.selectedLocationOnClick = function(location, $event){
      _self.loadEquipments.call(_self, location, $event);
    }

    this.$scope.locationDoubleClick = function($event){
      var location = $event.currentTarget._data;
      if(location.children && location.children.length >0){
        _self.selectLocation(location);
      }
    };

    /**
     * main controller on click
     * @param  {[type]} mainController [description]
     * @param  {[type]} $event         [description]
     * @return {[type]}                [description]
     */
    /*
    this.$scope.mainControllerOnClick = function(mainController, $event){
      _self.setMainController.apply(_self, arguments);
    };
    */

    /**
     * sub controller on click
     * @param  {[type]} subController [description]
     * @param  {[type]} $event        [description]
     * @return {[type]}               [description]
     */
    /*
    this.$scope.subControllerOnClick = function(subController, $event){
      _self.setSubController.apply(_self, arguments);
    };
    */

    this.$scope.triggerControllerTypes = this.triggerControllerTypes;

    $('body').on('click', _self.hidePopover);
    
    /**
     * UI init
     */
    $timeout(function(){
      _self.initControllers();

      _self.sensorDroppable();
      _self.locationDroppable();
      _self.equipDroppable();
      _self.rightPanelDraggable();
      _self.controllerDraggable();
      _self.mainControllerDroppable();
    });
    

    this._$panel.on(PanelControl.Events.ITEM_START_DRAG, function(){ _self.onItemDragginStart.apply(_self, arguments); });
    this._$panel.on(PanelControl.Events.ITEM_STOP_DRAG, function(){ _self.onItemDragginStop.apply(_self, arguments); });
    this._$panel.on(PanelControl.Events.ITEM_START_DELETE, function(){ _self.onItemRemoveStart.apply(_self, arguments); });
    this._$panel.on(PanelControl.Events.ITEM_STOP_DELETE, function(){ _self.onItemRemoveStop.apply(_self, arguments); });
    this._$panel.on(PanelControl.Events.ITEM_ADDED, function(){ _self.onItemsChanged.apply(_self, arguments); });
    this._$panel.on(PanelControl.Events.ITEM_DESTROYED, function(){ _self.onItemsChanged.apply(_self, arguments); });
  };


  PanelControl.prototype.initControllers = function(){
    var _self = this;
    this._$controllerPanel.find('.draggable-item').each(function(i){
      this._data = _self.triggerControllerTypes[i];
      this._dataType = PanelControl.DataTypes.CONTROLLER;
    });
  };

  PanelControl.prototype.onItemsChanged = function(e){
    this.redraw();
  };

  PanelControl.prototype.hidePopover = function(e){
    //did not click a popover toggle or popover
    if ($(e.target).data('toggle') !== 'popover'
      && $(e.target).parents('.popover.in').length === 0) { 
      $('[data-toggle="popover"]').popover('hide');
    }
  }

  PanelControl.prototype.loadSensors = function(location, $event){
    var _self = this;
    $$Thing.byTag({tagType: 'Location', displayName: location.id}, function(things){
      var sensors = things;

      _self.dataContainer.popedSensors = sensors;
      $timeout(function(){
        var items = $('#sensor-holder').find('.sensor');
        var $original = $($event.currentTarget);
        var $popover = $original.popover('show').data('bs.popover').$tip;

        //_self.hidePopoverInit($original, $popover)

        $popover.find('.popover-content').html('');
        $popover.find('.popover-content').append(items);
        _.each(sensors, function(sensor, index){
          items[index]._data = sensor;
          items[index]._dataType = PanelControl.DataTypes.SENSOR;
        });
        _self.sensorDraggable();
      });
    });
  };

  PanelControl.prototype.loadEquipments = function(location, $event){
    //$event.stopPropogation();
    var $obj = $($event.currentTarget);
    var _self = this;

    $$Thing.byTag({tagType: 'Location', displayName: location.id}, function(things){
      var types = _.uniq(_.pluck(things, 'type'));

      _self.dataContainer.popedEquipments = types;

      $timeout(function(){
        var $items = $('#equipment-holder').find('.equip').clone();
        var $original = $($event.currentTarget);
        var $popover = $original.popover('show').data('bs.popover').$tip;

        $popover.find('.popover-content').html('');
        $popover.find('.popover-content').append($items);

        _.each(types, function(type, index){
          $items[index]._data = type;
          $items[index]._dataType = PanelControl.DataTypes.EQUIPMENT;
        });

        _self.equipDraggable();
      });
    });
    $timeout(function(){
      $obj.popover('show');
    });
  };

  PanelControl.prototype.sensorDroppable = function(){
    var _self = this;
    this._$rightPanel.cols.sensors.droppable({
      accept: '.sensor-popover .draggable-item',
      drop: function(){
        _self.onSensorDrop.apply(_self, arguments);
        _self.rightPanelDraggable();
      } 
    });
  };

  PanelControl.prototype.sensorDraggable = function(){
    var _self = this;
    var $items = $('.popover.sensor-popover').find('.draggable-item');

    $items.draggable({
      containment: _self._$panel,
      helper: 'clone',
      cursor: 'move',
      scroll: false,
      revert: function(droppable){
        return !droppable || droppable[0] != _self._$rightPanel.cols.sensors[0];
      },
      appendTo: _self._$rightPanel.cols.sensors,
      start: function(event, e){
        e.helper[0]._data = e.helper.context._data;
        e.helper[0]._dataType = PanelControl.DataTypes.SENSOR;
        var event = jQuery.Event(PanelControl.Events.ITEM_START_DRAG);

        event._action = PanelControl.DragActions.DRAGGIN_SENSOR;
        $(e.helper[0]).addClass('dragged');
        _self._$panel.trigger(event);
        $('.popover.sensor-popover').hide();
      },
      stop: function(event, e){
        var event = jQuery.Event(PanelControl.Events.ITEM_STOP_DRAG);
        event._action = PanelControl.DragActions.DRAGGIN_SENSOR;
        $(e.helper[0]).removeClass('dragged');
        _self._$panel.trigger(event);
        $('.popover.sensor-popover').show();
      }
    })
  };

  PanelControl.prototype.locationDroppable = function(){
    var _self = this;
    this._$rightPanel.cols.locations.droppable({
      accept: '.left-panel .item-container .draggable-item',
      drop: function(){
        _self.onLocationDrop.apply(_self, arguments);
        _self.rightPanelDraggable();
      } 
    });
  };

  /**
   * settings of [location drag to create]
   * @return {[type]}       [description]
   */
  PanelControl.prototype.controllerDraggable = function(){
    var _self = this;
    var $items = this._$controllerPanel.find('.draggable-item');

    $items.draggable({
      cursor: 'move',
      helper: 'clone',
      scroll: false,
      revert: function(droppable){
        if(!droppable){
          return true;
        }
        if($(droppable[0]).hasClass('controller-holder')){
          return false;
        }else{
          return true;
        }
      },
      start: function (event, e) {
        e.helper[0]._data = e.helper.context._data;
        e.helper[0]._dataType = PanelControl.DataTypes.CONTROLLER;
        var event = jQuery.Event(PanelControl.Events.ITEM_START_DRAG);
        event._action = PanelControl.DragActions.DRAGGIN_CONTROLLER;
        $(e.helper[0]).addClass('dragged');
        _self._$panel.trigger(event);
      },
      stop: function (event, e) {
        var event = jQuery.Event(PanelControl.Events.ITEM_STOP_DRAG);
        event._action = PanelControl.DragActions.DRAGGIN_CONTROLLER;
        $(e.helper[0]).remove();
        _self._$panel.trigger(event);
      }
    });
  };

  PanelControl.prototype.mainControllerDroppable = function(){
    var _self = this;
    this._$rightPanel.cols.mainController.find('.controller-holder').droppable({
      accept: '.left-panel .draggable-item.controller',
      drop: function(){
        _self.onMainControllerDrop.apply(_self, arguments);
        _self.rightPanelDraggable();
      } 
    });
  };

  PanelControl.prototype.subControllerDroppable = function($ctrlHolder, index){
    var _self = this;
    $ctrlHolder.droppable({
      accept: '.controller-container .draggable-item',
      drop: function(event, e){
        _self.onSubControllerDrop.call(_self, event, e, index);
        _self.rightPanelDraggable();
      } 
    });
  };

  PanelControl.prototype.onMainControllerDrop = function(event, e){
    var _self = this;

    this.dataContainer.mainController = _.clone(e.helper[0]._data);

    this.$scope.$apply();
    $timeout(function(){
      var mainController = _self._$rightPanel.cols.mainController.find('.controller-holder')[0];

      mainController._data = _self.dataContainer.mainController;
      mainController._dataType = PanelControl.DataTypes.MAIN_CONTROLLER;

      _self._$panel.trigger(PanelControl.Events.ITEM_ADDED);
    });
  };

  PanelControl.prototype.onSubControllerDrop = function(event, e, index){
    var _self = this;

    this.dataContainer.equipments[index].subController = _.clone(e.helper[0]._data);

    this.$scope.$apply();
    $timeout(function(){
      var subController = _self._$rightPanel.cols.subController.find('.controller-holder').eq(index).find('.draggable-item')[0];

      subController._data = _self.dataContainer.equipments[index].subController;
      subController._data.parent = _self.dataContainer.equipments[index];
      subController._dataType = PanelControl.DataTypes.SUB_CONTROLLER;
      
      _self._$panel.trigger(PanelControl.Events.ITEM_ADDED);
    });
  };


  /**
   * settings of [item drag to create]
   * @return {[type]}       [description]
   */
  PanelControl.prototype.locationDraggable = function(){
    var _self = this;
    var newItems = [];

    _.each(this._$locationPanel.find('.draggable-item'), function(item){
      if(!$(item).data('draggable')){
        newItems.push(item);
      }
    });

    $(newItems).draggable({
      cursor: 'move',
      helper: 'clone',
      scroll: false,
      appendTo: _self._$rightPanel.cols.locations,
      start: function (event, e) {
        e.helper[0]._data = e.helper.context._data;
        e.helper[0]._dataType = PanelControl.DataTypes.LOCATION;
        var event = jQuery.Event(PanelControl.Events.ITEM_START_DRAG);

        event._action = PanelControl.DragActions.DRAGGIN_LOCATION;
        $(e.helper[0]).addClass('dragged');
        _self._$panel.trigger(event);
      },
      stop: function (event, e) {
        var event = jQuery.Event(PanelControl.Events.ITEM_STOP_DRAG);
        event._action = PanelControl.DragActions.DRAGGIN_LOCATION;
        $(e.helper[0]).removeClass('dragged');
        _self._$panel.trigger(event);
      }
    });

    $(newItems).popover({
      container: _self._$panel.selector,
      placement: 'right',
      trigger: 'none',
      template: PanelControl.PopoverSensorTemplate,
      viewport: _self._$panel,
      title: 'Sensors',
      content: ''
    });
  };

  /**
   * equipment droppable
   * @return {[type]} [description]
   */
  PanelControl.prototype.equipDroppable = function(){
    var _self = this;
    this._$rightPanel.cols.equipments.droppable({
      accept: '.equip-popover .draggable-item',
      drop: function(){
        _self.onEquipmentDrop.apply(_self, arguments);
        _self.rightPanelDraggable();
      } 
    });
  };

  /**
   * equipment draggable
   * @return {[type]} [description]
   */
  PanelControl.prototype.equipDraggable = function(){
    var _self = this;
    var $items = $('.popover.equip-popover').find('.draggable-item');

    $items.draggable({
      containment: _self._$panel,
      helper: 'clone',
      cursor: 'move',
      scroll: false,
      revert: function(droppable){
        return !droppable || droppable[0] != _self._$rightPanel.cols.equipments[0];
      },
      appendTo: _self._$rightPanel.cols.equipments,
      start: function(event, e){
        e.helper[0]._data = e.helper.context._data;
        e.helper[0]._dataType = PanelControl.DataTypes.EQUIPMENT;
        var event = jQuery.Event(PanelControl.Events.ITEM_START_DRAG);

        event._action = PanelControl.DragActions.DRAGGIN_EQUIP;
        $(e.helper[0]).addClass('dragged');
        _self._$panel.trigger(event);
        $('.popover.equip-popover').hide();
      },
      stop: function(event, e){
        var event = jQuery.Event(PanelControl.Events.ITEM_STOP_DRAG);
        event._action = PanelControl.DragActions.DRAGGIN_EQUIP;
        $(e.helper[0]).removeClass('dragged');
        _self._$panel.trigger(event);
        $('.popover.equip-popover').show();
      }
    })
  };

  PanelControl.prototype.selectLocation = function(location){
    var _self = this;
    this.$scope.selectedLocationNode = location;
    this.locationLink.push(location);
    if(!this.$scope.$$phase) {
      this.$scope.$apply();
    }

    $timeout(function(){
      var $locations = _self._$locationPanel.find('.draggable-item');

      _.each(_self.$scope.selectedLocationNode.children, function(location, i){
        $locations[i]._data = location;
      });

      _self.locationDraggable();
    });
  };

  PanelControl.prototype.backToParentLocation = function(){
    this.locationLink.splice(this.locationLink.length, 1);
    this.selectLocation(this.locationLink[this.locationLink.length - 1]);
  };

  /**
   * settings of [item drag to delete ]
   * @return {[type]}       [description]
   */
  PanelControl.prototype.rightPanelDraggable = function(){
    var _self = this;
    var $droppable = _self._$toolPanel.find('.item-holder-when-draggin');

    _.each(this._$panel.find('.col .draggable-item'), function(item){
      if($(item).data('draggable')){
        $(item).draggable('destroy');
      }
    });

    this._$panel.find('.col .draggable-item:not(.tip)').draggable({
      cursor: 'move',
      scroll: false,
      //appendTo: _self._$toolPanel,
      appendTo: $droppable,
      revert: function(droppable){
        return !droppable || droppable[0] != $droppable[0];
      },
      start: function (event, e) {
        $(event.toElement).one('click', function(e){ e.stopImmediatePropagation(); } );
        //$(e.helper.context).bind("click.prevent", function(event) { event.preventDefault(); });

        var event = jQuery.Event(PanelControl.Events.ITEM_START_DELETE);
        $(e.helper[0]).addClass('dragged');
        _self._$panel.trigger(event);
      },
      stop: function (event, e) {
        //setTimeout(function(){$(e.helper.context).unbind("click.prevent");}, 300);

        var event = jQuery.Event(PanelControl.Events.ITEM_STOP_DELETE);
        _self._$panel.trigger(event);
        $(e.helper[0]).removeClass('dragged');
      }
    });
  };

  PanelControl.prototype.onItemRemoveStart = function(e){
    $('.tool-panel').addClass('in');
  };

  PanelControl.prototype.onItemRemoveStop = function(e){
    $('.tool-panel').removeClass('in');
  };

  /**
   * when item being dragged into panel
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  PanelControl.prototype.onItemDragginStart = function(e){
    var _self = this;

    switch(e._action){
      case PanelControl.DragActions.DRAGGIN_SENSOR:
        sensorDraggin(e);
        break;
      case PanelControl.DragActions.DRAGGIN_LOCATION:
        locationDraggin(e);
        break;
      case PanelControl.DragActions.DRAGGIN_EQUIP:
        equipDraggin(e);
        break;
      case PanelControl.DragActions.DRAGGIN_CONTROLLER:
        controllerDraggin(e);
        break;
    }

    function sensorDraggin(e){
      _self._$rightPanel.cols.sensors.find('.tip').addClass('active');
      //$('.col.col-2').append('<div class="item-holder-when-draggin"><span class="fa fa-plus"></span></div>')
    }

    function locationDraggin(e){
      _self._$rightPanel.cols.locations.find('.tip').addClass('active');
    }

    function equipDraggin(e){
      _self._$rightPanel.cols.equipments.find('.tip').addClass('active');
    }

    function controllerDraggin(e){
      _self._$rightPanel.cols.mainController.find('.draggable-item').hide();
      _self._$rightPanel.cols.subController.find('.draggable-item').hide();
      _self._$rightPanel.cols.mainController.find('.draggable-item').parent().siblings('.tip').show();
      _self._$rightPanel.cols.subController.find('.draggable-item').parent().siblings('.tip').show();

      _self._$rightPanel.cols.mainController.find('.tip').addClass('active in');
      _self._$rightPanel.cols.subController.find('.tip').addClass('active in');
    }
  };

  /**
   * when item is dragged into panel 
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  PanelControl.prototype.onItemDragginStop = function(e){
    var _self = this;

    switch(e._action){
      case PanelControl.DragActions.DRAGGIN_SENSOR:
        sensorDraggin();
        break;
      case PanelControl.DragActions.DRAGGIN_LOCATION:
        locationDraggin();
        break;
      case PanelControl.DragActions.DRAGGIN_EQUIP:
        equipDraggin();
        break;
      case PanelControl.DragActions.DRAGGIN_CONTROLLER:
        controllerDraggin(e);
        break;
    }

    function sensorDraggin(){
      _self._$rightPanel.cols.sensors.find('.tip').removeClass('active');
    };

    function locationDraggin(e){
      _self._$rightPanel.cols.locations.find('.tip').removeClass('active');
    }

    function equipDraggin(e){
      _self._$rightPanel.cols.equipments.find('.tip').removeClass('active');
    }

    function controllerDraggin(e){
      _self._$rightPanel.cols.mainController.find('.draggable-item').show();
      _self._$rightPanel.cols.subController.find('.draggable-item').show();
      _self._$rightPanel.cols.mainController.find('.draggable-item').parent().siblings('.tip').hide();
      _self._$rightPanel.cols.subController.find('.draggable-item').parent().siblings('.tip').hide();

      _self._$rightPanel.cols.mainController.find('.tip').removeClass('active in');
      _self._$rightPanel.cols.subController.find('.tip').removeClass('active in');
    }
  };

  PanelControl.prototype.onDropDelete = function(event, e){
    var _self = this;
    var ele = e.helper[0];
    
    var data = ele._data;
    var dataType = ele._dataType;

    switch(dataType){
      case PanelControl.DataTypes.SENSOR:
        this.dataContainer.sensors.remove(data);
        break;
      case PanelControl.DataTypes.LOCATION:
        this.dataContainer.locations.remove(data);
        break;
      case PanelControl.DataTypes.EQUIPMENT:
        this.dataContainer.equipments.remove(data);
        break;
      case PanelControl.DataTypes.SUB_CONTROLLER:
        data.parent.subController = null;
    }

    $(ele).remove();
    this.$scope.$apply();
    $timeout(function(){
      _self._$panel.trigger(PanelControl.Events.ITEM_DESTROYED);
    });
  };

  PanelControl.prototype.onSensorDrop = function(event, e){
    var _self = this;

    this.dataContainer.sensors.push(e.helper[0]._data);
    this.$scope.$apply();
    $timeout(function(){
      var sensors = _self._$rightPanel.cols.sensors.find('.sensor');
      _.each(_self.dataContainer.sensors, function(sensor, i){
        sensors[i]._data = sensor;
        sensors[i]._dataType = PanelControl.DataTypes.SENSOR;
      });
      _self._$panel.trigger(PanelControl.Events.ITEM_ADDED);
    });
  };

  PanelControl.prototype.onLocationDrop = function(event, e){
    var _self = this;

    this.dataContainer.locations.push(e.helper[0]._data);
    this.$scope.$apply();
    $timeout(function(){
      var locations = _self._$rightPanel.cols.locations.find('.location');
      _.each(_self.dataContainer.locations, function(location, i){
        locations[i]._data = location;
        locations[i]._dataType = PanelControl.DataTypes.LOCATION;

        var placement = $(locations[i]).offset().top - _self._$panel.offset().top < 200? 'bottom': 'top';

        $(locations[i]).popover({
          container: _self._$panel.selector,
          placement: placement,
          template: PanelControl.PopoverEquipTemplate,
          trigger: 'none',
          viewport: _self._$panel,
          title: 'Equipments',
          content: ''
        });
      });



      _self._$panel.trigger(PanelControl.Events.ITEM_ADDED);
    });
  };

  PanelControl.prototype.onEquipmentDrop = function(event, e){
    var _self = this;
    var obj = {
      type: e.helper[0]._data
    }

    this.dataContainer.equipments.push(obj);
    this.$scope.$apply();
    $timeout(function(){
      var equipments = _self._$rightPanel.cols.equipments.find('.equip');
      var $ctrlHolders = _self._$rightPanel.cols.subController.find('.controller-holder');

      _.each(_self.dataContainer.equipments, function(equipment, i){
        equipments[i]._data = equipment;
        equipments[i]._dataType = PanelControl.DataTypes.EQUIPMENT;
        _self.subControllerDroppable($ctrlHolders.eq(i), i);
      });
      _self._$panel.trigger(PanelControl.Events.ITEM_ADDED);

    });
  };


  PanelControl.prototype.redraw = function(){
    var _self = this;

    this.graph.selectAll('*').remove();
    $timeout(function(){
      _self.drawLineBetweenObjs();
    },100);
  }

  PanelControl.prototype.drawLineBetweenObjs = function(){
    var _self = this;

    var $sensors = this._$rightPanel.cols.sensors.find('.sensor').find('.fa');
    var $locations = this._$rightPanel.cols.locations.find('.location').find('.fa');
    var $mainController = this._$rightPanel.cols.mainController.find('.controller-holder');
    var $subControllers = this._$rightPanel.cols.subController.find('.controller-holder');
    var $equips = this._$rightPanel.cols.equipments.find('.equip').find('.fa');
    
    var $draggableItem = $mainController.find('.draggable-item .fa');
    if($draggableItem.length){
      $mainController = $draggableItem
    }else{
      $mainController = this._$rightPanel.cols.mainController.find('.tip .fa');
    }

    if(!$subControllers.length){
      $subControllers = this._$rightPanel.cols.subController.find('.tip .fa');
    }else{
      $subControllers.each(function(i){
        var $draggableItem = $subControllers.eq(i).find('.draggable-item .fa');
        if(!$draggableItem.length){
          $subControllers[i] = $subControllers.eq(i).find('.tip .fa');
        }else{
          $subControllers[i] = $draggableItem[0];
        }
      });
    }

    if($equips.length && $locations.length){
      _.each($subControllers, function(subController, i){
        drawLine($($subControllers[i]), $mainController);
        drawLine($($subControllers[i]), $equips.eq(i));
      });

      if($locations.length){
        drawLine($mainController, $locations.eq(0));
      }

      _.each($sensors, function(sensor, i){
        drawLine($sensors.eq(i), $locations.eq(0));
      });
    }

    function drawLine($obj1, $obj2){
      var left = $('.panel-wrapper').offset().left;
      var top = $('.panel-wrapper').offset().top;

      var beginX = $obj1.offset().left + $obj1.width()/2 - left;
      var beginY = $obj1.offset().top + $obj1.height()/2 - top;
      var endX = $obj2.offset().left + $obj2.width()/2 - left;
      var endY = $obj2.offset().top + $obj2.height()/2 - top;

      var midX = beginX + (endX - beginX) * 0.382;
      var midY = beginY;

      _self.graph.append('line')
        .attr('x1', beginX)
        .attr('y1', beginY)
        .attr('x2', midX)
        .attr('y2', midY)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

      _self.graph.append('line')
        .attr('x1', midX)
        .attr('y1', midY)
        .attr('x2', endX)
        .attr('y2', endY)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

    }
  };

  PanelControl.prototype.destroy = function(){
    $(window).unbind('resize', this.redrawBinder);
    $('body').unbind('click', this.hidePopover);
  };

  return TriggerPanelService;
}])