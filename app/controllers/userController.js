import * as User from '../models/User';
import {log} from '../modules/logger';

export function* create(){
  const query = this.request.body;
  this.type = 'application/json';

  try{
    const doc = yield User.create(query);
    this.status = 201;
    this.body = doc;
  }
  catch(error){
    log.error({'userController#create': { query, error }});

    if (/duplicate key error index.*email/.test(error)) {
      this.status = 409;
      this.body = {
        errors: [
          {
            status     : this.status,
            title      : 'Ya registrado',
            description: 'El email que ingresaste ya está registrado. Intenta con otro email'
          }]};
    } else {
      this.status = 500;
      this.body = {
        errors: [
          {
            status     : this.status,
            title      : 'Error al crear el Usuario',
            description: 'No Pudimos crear el Usuario. Revisa tus datos e intenta nuevamente!'
          }
        ]
      };
    }

  }
}


// TODO: revisar/cambiar logs
export function* unsubscribe(){
  try{
    const paramEmail = this.request.query.email;
    const paramToken = this.request.query.token;

    const user = yield User.find({email: paramEmail});

    if(user.token !== paramToken){
      throw Error('Token inválido!');
    }

    const uns = yield User.unSubscribe(user.email);

    if(uns.nModified !== 1){
      throw Error('Error al cancelar subscripción!');
    }

    this.status = 200;
    this.body = 'REVISANDOO....';
  }
  catch(error){
    this.status = 400;
    this.body = 'Error!';
  }

}
