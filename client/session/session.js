import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { SessionsCollection, PlayersCollection, SESSION_STATES } from '../../lib/collections';

import './session.jade';

const getCurrentSessionQuery = () => {
    return {
        number: Session.get('sessionNumber')
    }
};

const getCurrentSession = () => {
  return SessionsCollection.findOne(getCurrentSessionQuery());  
};

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
    
    Meteor.call('playerOnline', player._id);
};

Template.session.rendered = () => {
    new Clipboard('.session__copy-url-btn');
    setNewInterval();
};

Template.session.onDestroyed = clearInterval; 



Template.session.helpers({
    session: getCurrentSession,

    players: () => PlayersCollection.find({
        sessionNumber: Session.get('sessionNumber')
    }),

    isOpen: () => getCurrentSession().state === SESSION_STATES.open,

    getCardClass: function () {
        let classes = [];
        const state = getCurrentSession().state;
        const player = this;
        const myName = Session.get('playerName');

        if (myName === player.name) {
            classes.push('card_flipped_yes');
            classes.push('card_yours_yes');
        } else {
            state === SESSION_STATES.open && classes.push('card_flipped_yes');
        }
        
        return classes.join(' ');
    }
});

Template.session.events({
    'click .session-player-cards .card': function (e) {
        let value = e.currentTarget.dataset.value;
        let player = currentPlayer();
        
        Meteor.call('chooseCard', player._id, value);
    },
    'click .session__show-cards-btn': () => Meteor.call('showCards', Session.get('sessionNumber')),
    'click .session__clear-cards-btn': () => Meteor.call('clearCards', Session.get('sessionNumber'))
});
