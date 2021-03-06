var Marionette = require('backbone.marionette')
;

var ServiceView = Backbone.Marionette.ItemView.extend({
    template: require('../../templates/service_item.hbs'),
    tagName: "option",
    onRender: function(){
        this.$el.attr('value', this.model.get('serviceId'));
    }
});

var ServicesView = Marionette.CompositeView.extend({
    template: require('../../templates/events.hbs'),
    itemViewContainer: "select",
    itemView: ServiceView,
    events: {
        'change select': 'showEvents'
    },
    onRender: function() {
        this.showEvents();
    },
    initialize: function(options) {
        this.eventsCol = options.eventsCol;
    },
    showEvents: function() {
        var id = this.$el.find('#service').val();
        this.model = this.collection.get(id);
        this.$el.find("#events").html("");
        var events = this.eventsCol;
        window.App.core.vent.trigger('app:showloading');
        var self = this;
        events.fetch({data: {serviceId: this.model.id}}).always(function() {
            if (events) {
                self.subView = new EventsView({collection: events});
                self.subView.render().$el.appendTo(self.$el.find("#events"));
            }
            window.App.core.vent.trigger('app:hideloading');
        });
    }
});

var itemView = Marionette.ItemView.extend({
    template: require('../../templates/event_row.hbs'),
    tagName: "tr",
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },
    events: {
        'click': 'showDetails'
    },
    showDetails: function() {
        window.App.core.vent.trigger('app:log', 'Events View: showDetails hit.');
        window.App.controller.eventDetails(this.model.id);
    }
});

var EventsView = Marionette.CompositeView.extend({
    tagName: "table",
    template: require('../../templates/events_table.hbs'),
    className: "EpgTable",
    itemViewContainer: "tbody",
    itemView: itemView,
    initialize: function() {
        console.log("col", this.collection);
    }
});

module.exports =  ServicesView;