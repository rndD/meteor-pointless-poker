import { Meteor } from 'meteor/meteor';
import { PlayersCollection } from '/lib/collections';

Meteor.startup(() => {
    const tenSeconds = 10 * 1000;
    Meteor.setInterval(function () {
        const now = (new Date()).getTime();

        PlayersCollection.find({
            'online': true,
            'lastActivity': {$lt: (now - tenSeconds)}
        }).forEach(function (player) {
            PlayersCollection.update(player._id, {$set: {'online': false}});
            Meteor.call('chooseCard', player._id, null);
        });
    }, tenSeconds);
});
