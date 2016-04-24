import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { SessionsCollection, PlayersCollection } from '../../lib/collections';

import './session.jade';

const createPlayer = (name, sessionNumber) => {
    return PlayersCollection.insert({
        name,
        sessionNumber,
        currentCard: null,
        online: true,
        lastActivity: (new Date()).getTime()
    });
};

const playerExist = (name, sessionNumber) => {
    return Boolean(PlayersCollection.findOne({name, sessionNumber}));
};

Template.session_player_choose.helpers({
    session: () => SessionsCollection.findOne({ number: Session.get('sessionNumber')}),
});

Template.session_player_choose.events({
    'submit form': function(e) {
        e.preventDefault();
        let name = e.target.name.value;
        let sessionNumber = Session.get('sessionNumber');

        if (!playerExist(name, sessionNumber)) {
            createPlayer(name, sessionNumber);
        }

        Router.go('session', { number: sessionNumber, name});
    }
});