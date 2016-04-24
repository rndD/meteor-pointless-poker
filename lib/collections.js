import { Mongo } from 'meteor/mongo';

export const SessionsCollection = new Mongo.Collection('Sessions');
export const PlayersCollection = new Mongo.Collection('Players');

export const SESSION_STATES = {
    close: 'CLOSE',
    open: 'OPEN'
};