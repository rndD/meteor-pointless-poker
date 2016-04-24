import { Template } from 'meteor/templating';

import { SessionsCollection, SESSION_STATES } from '../../lib/collections';

import './lobby.jade';

/**
 * @returns {Number} new session number
 */
const createNewSession = () => {
    let number = getIncNumber();
    
    SessionsCollection.insert({
        number: number,
        currentSubj: 'Task #',
        state: SESSION_STATES['close'],
        cards: [1, 2, 3, 5, 8, 13, '?']
    });
    
    return number;
};

/**
 * @returns {Number}
 */
const getIncNumber = () => {
    if (SessionsCollection.find({}).count() === 0) {
        return 0;
    } else {
        let currentNumber = SessionsCollection.findOne({},{sort:{number:-1}}).number || 0;
        return currentNumber + 1;
    }
};


Template.lobby.helpers({
    sessions: () => SessionsCollection.find()
    
});

Template.lobby.events({
    'click .lobby__create-new-session-btn': function (e) {
        let sessionNumber = createNewSession();
        Router.go('session_player_choose', { number: sessionNumber });
    }
});
