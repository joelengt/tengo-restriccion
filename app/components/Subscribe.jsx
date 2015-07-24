/*global $*/
import React from 'react';
import {merge} from 'ramda';
import {put} from 'axios';
import {isEmail} from 'validator';
import {getValidatorClass, allValid} from '../utils/formHelper';


export default class Subscribe extends React.Component {
  constructor() {
    super();
    this.state = {
      user : {},
      valid: {
        email            : null,
        selloVerde       : null,
        numeroRestriccion: null
      }
    };
  }

  componentDidMount() {
    // Use Materialize custom select input
    $(this.refs.restrictionDigitSelect).material_select(this._handleRestrictionDigitChange.bind(this));
  }

  render() {
    const emailClass = `${getValidatorClass(this.state.valid.email)}`;
    const submitClass = `${allValid(this.state.valid) ? null : 'disabled'} waves-effect waves-light btn-large`;

    return (
      <section className="subscripcion">
        <h4 className="white-text">Te notificamos cuanto estes en restricción</h4>
        <form action="">
          <div className="row">
             <div className="input-field select col s12 m7">
               <select ref="restrictionDigitSelect" defaultValue="0">
                <option value="" disabled>Selecciona último dígito de tu patente </option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
             </div>
             <div className="col m3 s12 offset-m2">
               <p>
                <input onChange={this._handleChange.bind(this, 'sinSelloVerde')} name="sello" type="radio" id="sin_sello" />
                <label htmlFor="sin_sello">Sin sello verde</label>
              </p>
              <p>
                <input onChange={this._handleChange.bind(this, 'conSelloVerde')} name="sello" type="radio" id="con_sello" />
                <label htmlFor="con_sello">Con sello verde</label>
              </p>
             </div>
           </div>
           <div className="row">
             <div className="input-field col s12">
               <input onChange={this._handleEmailChange.bind(this)} id="email" type="email" className={emailClass} />
               <label htmlFor="email">Email</label>
             </div>
           </div>
           <div className="row">
             <a onClick={this._handleSubmit.bind(this)} className={submitClass}>
               <i className="material-icons left"></i>Enviar
              </a>
           </div>
           <div className="row">
             <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-yellow-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div><div className="gap-patch">
                    <div className="circle"></div>
                  </div><div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
           </div>
           <div className="row alertForm alertTrue">
             <span>Se realizo tu registro con exito!</span>
           </div>
           <div className="row alertForm alertFalse">
             <span>Lo siento! Surgio un error, vuelve a revisar tu formulario.</span>
           </div>
        </form>
      </section>
    );
  }

  _handleChange(key) {
    const value = (key === 'conSelloVerde');
    this._setFormState('selloVerde', value, true);
  }

  _handleEmailChange(e) {
    const value = e.currentTarget.value; //TODO: e.target en react 0.14.0-beta2
    this._setFormState('email', value, isEmail(value));
  }

  _handleRestrictionDigitChange() {
    this._setFormState('numeroRestriccion', this.refs.restrictionDigitSelect.value, true);
  }

  _setFormState(key, value, isValid) {
    this.setState(
      merge(this.state, {
        user : merge(this.state.user, {[key]: value}),
        valid: merge(this.state.valid, {[key]: isValid})
      }));
  }

  async _handleSubmit() {
    console.log(this.state);
    try {
      const response = await put('/users', this.state.user);
      console.log(response);
    }
    catch (error) {
      console.log(error);
    }
  }
}