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
  },
  {
    id: 6, name: 'in an open field',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 9 },
          { direction: 'south', destination: 7 }
        ]
      }
    ]
  },
  {
    id: 7, name: 'at the edge of a forest',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 6 }
        ]
      }
    ],
    actions: [
      
    ],
    reactions: [
      
    ]
  },
  {
    id: 8, name: 'on the branch of a tree',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'down', destination: 7 }
        ]
      },
      { key: 'isClimbable', isImmutable: true, value: true }
    ]
  },
  {
    id: 9, name: 'on a long, winding road',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'south', destination: 6 },
          { direction: 'east', destination: 10 }
        ]
      }
    ]
  },
  {
    id: 10, name: 'on a long, winding road',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 11 },
          { direction: 'west', destination: 9 }
        ]
      }
    ]
  },
  {
    id: 11, name: 'on a long, winding road',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'south', destination: 10 },
          { direction: 'west', destination: 12 }
        ]
      }
    ]
  },
  {
    id: 12, name: 'on the south bank of a river',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'east', destination: 11 }
        ]
      }
    ]
  },
  {
    id: 13, name: 'in a wooden boat'
  },
  {
    id: 14, name: 'on the north bank of a river',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 15 }
        ]
      }
    ]
  },
  {
    id: 15, name: 'on a well-traveled road',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 16 },
          { direction: 'south', destination: 14 }
        ]
      }
    ]
  },
  {
    id: 16, name: 'in front of a large castle',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'north', destination: 17 },
          { direction: 'south', destination: 15 }
        ]
      }
    ]
  },
  {
    id: 17, name: 'in a narrow hall',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'south', destination: 16 },
          { direction: 'up', destination: 18 }
        ]
      }
    ]
  },
  {
    id: 18, name: 'in a large hall',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'down', destination: 17 }
        ]
      }
    ]
  },
  {
    id: 19, name: 'at the top of a tree',
    states: [
      {
        key: 'exits', isImmutable: true,
        value: [
          { direction: 'down', destination: 8 }
        ]
      }
    ]
  }
];
