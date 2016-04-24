import { Meteor } from 'meteor/meteor';

import { SessionsCollection, PlayersCollection, SESSION_STATES } from '/lib/collections';

const getOnlinePlayers = (sessionNumber) => {
    return PlayersCollection.find({
        sessionNumber: sessionNumber,
        online: true
    }).fetch();
};

const checkIfAllVoted = (sessionNumber) => {
    let players = getOnlinePlayers(sessionNumber);
    return _.every(players, (p) => p.currentCard !== null);
};

PlayersCollection.find().observe({
    added: (player) => {
        Meteor.call('closeCards', player.sessionNumber);
    },
    changed: (newPlayer, oldPlayer) => {
        if (newPlayer.online && !oldPlayer.online) {
            Meteor.call('closeCards', newPlayer.sessionNumber);
        }
    }
});

Meteor.methods({
    playerOnline: (playerId) => {
        PlayersCollection.update(playerId, {
            $set: {'lastActivity': (new Date()).getTime(), online: true}
        });
    },
    
    showCards: (sessionNumber) => {
        let session = SessionsCollection.findOne({ number: sessionNumber });
        
        if (session.state === SESSION_STATES.close) {
            SessionsCollection.update(session._id, {
                $set: { 'state': SESSION_STATES.open }
            });
        }
    },
    
    closeCards: (sessionNumber) => {
        let session = SessionsCollection.findOne({ number: sessionNumber });
        
        if (session.state === SESSION_STATES.open) {
            SessionsCollection.update(session._id, {
                $set: { 'state': SESSION_STATES.close }
            });
        }
    },
    
    clearCards: (sessionNumber) => {
        getOnlinePlayers(sessionNumber).forEach((player) => {
            Meteor.call('chooseCard', player._id, null);
        });
        
        let session = SessionsCollection.findOne({ number: sessionNumber });

        SessionsCollection.update(session._id, {
            $set: { 'state': SESSION_STATES.close }
        });
    },
    
    chooseCard: (playerId, card) => {
        let player = PlayersCollection.findOne(playerId);
        PlayersCollection.update(playerId, {
            $set: {'currentCard': card}
        });

        if (checkIfAllVoted(player.sessionNumber)) {
            Meteor.call('showCards', player.sessionNumber);
        }
    },
    
    removeAll: () => {
        SessionsCollection.remove({});
        PlayersCollection.remove({});
    }
});