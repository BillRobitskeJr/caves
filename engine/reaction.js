/**
 * Game entity reaction encapsulation
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 */

// Symbols for semi-private members
const _reactor = Symbol('reactor');
const _trigger = Symbol('trigger');
const _actionVerb = Symbol('actionVerb');

/**
 * Game entity reaction class
 */
export default class Reaction {

  /**
   * @typedef     {Object}  Reaction.Trigger
   * @property    {string}  type        - Type of event that triggers reaction (i.e. action or stateUpdate)
   */

  /**
   * @typedef     {Reaction.Trigger}    Reaction.ActionTrigger
   * @property    {string}  verb        - Verb that triggers reaction when performed
   * @property    {string}  phase       - Action phase (i.e. start or complete) that triggers reaction
   */

  /**
   * @typedef     {Reaction.Trigger}    Reaction.StateUpdateTrigger
   * @property    {string}  key         - State key that triggers reaction when updated
   */

  /**
   * @typedef     {Object}  Reaction.Config
   * @property    {Entity}  trigger     - Event that triggers a reaction
   * @property    {string}  actionVerb  - Verb of action to to perform when reaction is triggered
   */

  /**
   * Create a new entity reaction
   * @param       {Reaction.Trigger}  reactor   - Entity able to perform this reaction
   * @param       {Reaction.Config}   config    - Definition of this reaction
   */
  constructor(reactor, config = {}) {
    this[_reactor] = reactor;
    this[_trigger] = Object.assign({ type: null }, config.trigger);
    this[_actionVerb] = config.actionVerb || '';
  }

  /**
   * @property    {Reaction.Trigger}  trigger   - 
   * @readonly
   */
  get trigger() { return Object.assign({}, this[_trigger]); }

  /**
   * @property    {Action}            action    - 
   * @readonly
   */
  get action() { return this[_reactor].getAction(this[_actionVerb]); }

  /**
   * Create a copy of this reaction for another actor
   * @param     {Entity}    reactor   - Entity able to perform the new copy of this reaction
   * @returns   {Reaction}            - New copy of this reaction
   */
  cloneForReactor(reactor) {
    return new Reaction(reactor, {
      trigger: this[_trigger],
      actionVerb: this[_actionVerb]
    });
  }
}
