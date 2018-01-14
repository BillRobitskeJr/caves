/**
 * The Quest - Game locations definition file
 * @copyright   Bill Robitske, Jr. 2018
 * @author      Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license     MIT
 * 
 * This game configuration is based on the example game, The Quest,
 * from How to Create Adventure Games by Christopher Lampton (1986).
 * Used under Fair Use.
 */

export default [
  {
    id: 1, name: 'in your living room',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 4 },
          { direction: 'south', destination: 3 },
          { direction: 'east', destination: 2 }
        ]
      }
    ]
  },
  {
    id: 2, name: 'in the kitchen',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'west', destination: 1 }
        ]
      }
    ]
  },
  {
    id: 3, name: 'in the library',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 1 }
        ]
      }
    ]
  },
  {
    id: 4, name: 'in the front yard',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'south', destination: 1 },
          { direction: 'west', destination: 5 }
        ]
      }
    ]
  },
  {
    id: 5, name: 'in the garage',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'east', destination: 4 }
        ]
      }
    ]
  }
];
