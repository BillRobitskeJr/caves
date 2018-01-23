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
      { key: 'isUngettable', isImmutable: true, value: true },
      { key: 'isClimbable', isImmutable: true, value: true }
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
      },
      {
        verbs: ['beClimbed'],
        start: (actor, command, output, entities) => {},
        complete: (actor, command, output, entities) => {
          if (command.object.id !== actor.id) return {};
          if (command.actor.getState('location') !== actor.getState('location')) return {};
          output.print(`After standing precariously on the rim of the barrel for a`, 'story');
          output.print(`moment, you hop back down.`, 'story');
          return {};
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
      },
      {
        trigger: { type: 'action', verb: 'climb', phase: 'complete' },
        actionVerb: 'beClimbed'
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
      { key: 'location', value: 5 },
      { key: 'isClimbable', isImmutable: true, value: true }
    ]
  },
  {
    id: 9, name: 'a shovel', tags: ['shovel'],
    states: [
      { key: 'location', value: 5 }
    ]
  },
  {
    id: 10, name: 'a tree', tags: ['tree'],
    states: [
      { key: 'isUngettable', isImmutable: true, value: true },
      { key: 'location', value: 7 },
      { key: 'isClimbable', isImmutable: true, value: true }
    ],
    actions: [
      {
        verbs: ['attemptToBeClimbed'],
        start: (actor, command, output, entities) => {
          if (command.object.id !== actor.id) return {};
          output.print(`You can't quite reach the branches.`, 'story');
          return { abort: true };
        },
        complete: (actor, command, output, entities) => {}
      }
    ],
    reactions: [
      {
        trigger: { type: 'action', verb: 'climb', phase: 'start' },
        actionVerb: 'attemptToBeClimbed'
      }
    ]
  },
  {
    id: 11, name: 'a golden sword', tags: ['sword']
  },
  {
    id: 12, name: 'a wooden boat', tags: ['boat'],
    states: [
      { key: 'isUngettable', isImmutable: true, value: true },
      { key: 'location', value: 12 },
      { key: 'interiorLocation', isImmutable: true, value: 13 }
    ]
  },
  {
    id: 13, name: 'a magic fan', tags: ['fan'],
    states: [
      { key: 'location', value: 8 }
    ]
  },
  {
    id: 14, name: 'a nasty-looking guard', tags: ['guard'],
    states: [
      { key: 'location', value: 16 }
    ]
  },
  {
    id: 15, name: 'a glass case', tags: ['case'],
    states: [
      { key: 'isUngettable', isImmutable: true, value: true },
      { key: 'location', value: 18 },
      { key: 'isOpenable', isImmutable: true, value: true },
      { key: 'contents', value: [16] },
      { key: 'isClimbable', isImmutable: true, value: true }
    ]
  },
  {
    id: 16, name: 'a glowing ruby', tags: ['ruby']
  },
  {
    id: 17, name: 'a pair of rubber gloves', tags: ['gloves'],
    states: [
      { key: 'location', value: 19 }
    ]
  }
];
