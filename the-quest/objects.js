/**
 * The Quest - Game objects definition file
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr.
 * @license     MIT
 * 
 * This game configuration is based on the example game, The Quest,
 * from How to Create Adventure Games by Christopher Lampton (1986).
 * Used under Fair Use.
 */

export default [
  {
    id: 1, name: 'an old diary', tags: ['diary'],
    states: [
      { key: 'location', value: 1 },
      { key: 'writing', value: `Add sodium chloride plus the formula to rainwater to reach the other world.` }
    ]
  },
  {
    id: 2, name: 'a small box', tags: ['box'],
    states: [
      { key: 'location', value: 1 },
      { key: 'isOpenable', isImmutable: true, value: true },
      { key: 'contents', value: [7] }
    ]
  },
  {
    id: 3, name: 'cabinet', tags: ['cabinet'],
    states: [
      { key: 'location', value: 2 },
      { key: 'isUngettable', isImmutable: true, value: true },
      { key: 'isOpenable', isImmutable: true, value: true },
      { key: 'contents', value: [4] }
    ]
  },
  {
    id: 4, name: 'a salt shaker', tags: ['salt', 'shaker'],
    states: [
      { key: 'isPourable', isImmutable: true, value: true },
      {
        key: 'description', isImmutable: true,
        value: (self) => {
          return self.getState('isEmpty') ? `The shaker is empty.` : `Woah!  It contains salt!`;
        }
      }
    ],
    actions: [
      {
        verbs: ['pourSalt'],
        start: (actor, command, output, entities) => {},
        complete: (actor, command, output, entities) => {
          if (actor.id !== command.object.id) return {};

          output.print(`The cap on the shaker falls off, and all of the salt pours out!`, 'story');
          const objectUpdates = {
            [actor.id]: { isEmpty: true }
          };
          const barrel = entities.objects.findEntity(object => object.tagExpression.test('barrel'));
          if (barrel && barrel.getState('location') === command.actor.getState('location')) {
            objectUpdates[barrel.id] = { containsSalt: true };
          }
          return {
            objects: objectUpdates
          };
        }
      }
    ],
    reactions: [
      {
        trigger: { type: 'action', verb: 'pour', phase: 'complete' },
        actionVerb: 'pourSalt'
      }
    ]
  },
  {
    id: 5, name: 'a dictionary', tags: ['dictionary'],
    states: [
      { key: 'location', value: 3 },
      { key: 'writing', isImmutable: true, value: `Sodium chloride. (n.) Formal cheminal name for common table salt.` }
    ]
  },
  {
    id: 6, name: 'a wooden barrel', tags: ['barrel'],
    states: [
      { key: 'location', value: 4 },
      { key: 'description', isImmutable: true, value: `It is filled with rainwater.` },
      { key: 'isUngettable', isImmutable: true, value: true }
    ],
    actions: [
      {
        verbs: ['updateBarrelMixture'],
        start: (actor, command, output, entities) => {},
        complete: (actor, command, output, entities) => {
          if (!actor.getState('containsFormula') || !actor.getState('containsSalt')) return {};
          output.print(`There's an explosion!`, 'story');
          output.print(`When you come to, you are...\n...somewhere else.`, 'story');
          return {
            player: { location: 6 }
          }
        }
      }
    ],
    reactions: [
      {
        trigger: { type: 'stateUpdate', key: 'containsFormula' },
        actionVerb: 'updateBarrelMixture'
      },
      {
        trigger: { type: 'stateUpdate', key: 'containsSalt' },
        actionVerb: 'updateBarrelMixture'
      }
    ]
  },
  {
    id: 7, name: 'a small bottle', tags: ['bottle', 'formula'],
    states: [
      { key: 'isPourable', isImmutable: true, value: true },
      {
        key: 'description', isImmutable: true,
        value: (self) => {
          const description = [`There's a hand-written label on the bottle.`];
          description.push(self.getState('isEmpty') ? `The bottle is empty.` : `The bottle is filled with a red liquid.`);
          return description.join('\n');
        }
      },
      { key: 'writing', isImmutable: true, value: 'Secret Forumula' }
    ],
    actions: [
      {
        verbs: ['pourFormula'],
        start: (actor, command, output, entities) => {},
        complete: (actor, command, output, entities) => {
          if (actor.id !== command.object.id) return {};

          output.print(`Although the contents appeared to be liquid, it comes out in a`, 'story');
          output.print(`single gummy blob.`, 'story');
          const objectUpdates = {
            [actor.id]: { isEmpty: true }
          };
          const barrel = entities.objects.findEntity(object => object.tagExpression.test('barrel'));
          if (barrel && barrel.getState('location') === command.actor.getState('location')) {
            objectUpdates[barrel.id] = { containsFormula: true };
          }
          return {
            objects: objectUpdates
          };
        }
      }
    ],
    reactions: [
      {
        trigger: { type: 'action', verb: 'pour', phase: 'complete' },
        actionVerb: 'pourFormula'
      }
    ]
  },
  {
    id: 8, name: 'a ladder', tags: ['ladder'],
    states: [
      { key: 'location', value: 5 }
    ]
  },
  {
    id: 9, name: 'a shovel', tags: ['shovel'],
    states: [
      { key: 'location', value: 5 }
    ]
  }
];
