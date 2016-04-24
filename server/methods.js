import { Meteor } from 'meteor/meteor';
import { PlayersCollection } from '/lib/collections';

Meteor.methods({
    playerOnline: (id) => {
        let player = PlayersCollection.findOne(id);
        PlayersCollection.update(player._id, {
            $set: {'lastActivity': (new Date()).getTime(), online: true}
        });
    }
});