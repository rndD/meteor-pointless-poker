import { Mongo } from 'meteor/mongo';

export const SessionsCollection = new Mongo.Collection('Sessions');
export const PlayersCollection = new Mongo.Collection('Players');
