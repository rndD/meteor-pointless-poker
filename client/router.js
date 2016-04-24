import { Meteor } from 'meteor/meteor';

Router.configure({
    layoutTemplate: 'layout'
});

Router.plugin('loading', {loadingTemplate: 'loading'});

Router.route('/', () => Router.go('/lobby'));

Router.route('/lobby', {
    waitOn: () => Meteor.subscribe('Sessions')
});

Router.route('/:number',
    {
        name: 'session_player_choose',
        template: 'session_player_choose',
        action: function () {
            let number = Number(this.params.number);
            Session.set("sessionNumber", number);
            this.render();
        },

        waitOn: function() {
            let number = Number(this.params.number);
            return [
                Meteor.subscribe('Sessions', number),
                Meteor.subscribe('Players', number)
            ];
        }
    }
);

Router.route('/:number/player/:name',
    {
        name: 'session',
        template: 'session',
        action: function () {
            let number = Number(this.params.number);
            let playerName = this.params.name;
            Session.set("sessionNumber", number);
            Session.set("playerName", playerName);
            this.render();
        },

        waitOn: function() {
            let number = Number(this.params.number);
            return [
                Meteor.subscribe('Sessions', number),
                Meteor.subscribe('Players', number)
            ];
        }
    }
);
