import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { SessionsCollection, PlayersCollection } from '../../lib/collections';

import './session.jade';

const currentPlayer = () => {
    let name = Session.get('playerName');
    let sessionNumber = Session.get('sessionNumber');
    return PlayersCollection.findOne({
        sessionNumber: sessionNumber,
        name: name
    });
};

var intervalId = null;
const clearInterval = () => {
    Meteor.clearInterval(intervalId);
};

const setNewInterval = () => {
    let player = currentPlayer();
    intervalId = Meteor.setInterval(() => {
        Meteor.call('playerOnline', player._id);
    }, 5000);
};

Template.session.rendered = () => {
    new Clipboard('.session__copy-url-btn');
    setNewInterval();
};

Template.session.onDestroyed = clearInterval; 



Template.session.helpers({
    session: () => SessionsCollection.findOne({ number: Session.get('sessionNumber')}),
    players: () => {
        return PlayersCollection.find({
            sessionNumber: Session.get('sessionNumber')
        });
    },
    cards: () => {
        return [0, 1, 2, 3, 5, 8, 13, '?'];
    }

});

Template.session.events({
    'click .player-card': function (e) {
        let value = e.currentTarget.dataset.value;
        let player = currentPlayer();
        
        player.currentCard = value;
        PlayersCollection.update(player._id, player);
    }
});

