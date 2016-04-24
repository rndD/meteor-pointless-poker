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


const showCards = () => {
    $('.card-container .card').not('.card_yours_yes').addClass('card_flipped_yes');
};

const hideCards = () => {
    console.log('hide');
    $('.card-container .card').not('.card_yours_yes').removeClass('card_flipped_yes');
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
    
    if (getCurrentSession().state === SESSION_STATES.open) {
        showCards();
    }

    SessionsCollection.find(getCurrentSessionQuery()).observe({
        changed: (newSession, oldSession) => {
            if (oldSession.state !== newSession.state) {
                if (newSession.state === SESSION_STATES.open) {
                    showCards();
                } else {
                    hideCards();
                }
            }
        }
    });
};

Template.session.onDestroyed = clearInterval; 



Template.session.helpers({
    session: getCurrentSession,
    players: () => {
        return PlayersCollection.find({
            sessionNumber: Session.get('sessionNumber')
        });
    },
    isOpen: () => getCurrentSession().state === SESSION_STATES.open,
    itIsYou: function () {
        let player = this;
        let name = Session.get('playerName');
        
        return name === player.name;
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

