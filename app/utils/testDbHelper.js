import mongoose from '../utils/mongoosePromise';
import {db} from '../config/db';

mongoose.connect(db);

const connection = mongoose.connection;

before( done => {
  connection.on('open', () => {
    connection.db.dropDatabase( () => done() );
  });
});

after( done => {
  connection.db.dropDatabase( () => {
    connection.close( () => done() );
  });
});

export function cleanUpAfterEach(Model) {
  afterEach( done => {
    Model.remove({}, () => done() );
  });
}
