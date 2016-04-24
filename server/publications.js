import { SessionsCollection, PlayersCollection } from '../lib/collections';

Meteor.publish('Sessions', function(number) {
    if (number !== undefined) {
        return SessionsCollection.find({number});
    }
    return SessionsCollection.find();
});

Meteor.publish('Players', function(sessionNumber) {
    if (sessionNumber !== undefined) {
        return PlayersCollection.find({sessionNumber});
    }
    return PlayersCollection.find();
});
