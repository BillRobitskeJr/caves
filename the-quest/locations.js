
export default [
  {
    id: 1, name: 'in your living room',
    exits: [
      { direction: 'east', destination: 9 }
    ]
  },
  {
    id: 2, name: 'in the kitchen',
    exits: [
      { direction: 'north', destination: 8 },
      { direction: 'east', destination: 10 },
      { direction: 'west', destination: 3 }
    ]
  },
  {
    id: 3, name: 'in the garage',
    exits: [
      { direction: 'north', destination: 8 },
      { direction: 'south', destination: 7 },
      { direction: 'east', destination: 2 }
    ]
  },
  {
    id: 4, name: 'in your bedroom',
    exits: [
      { direction: 'west', destination: 10 }
    ]
  },
  {
    id: 5, name: 'in the bathroom',
    exits: [
      { direction: 'south', destination: 10 }
    ]
  },
  {
    id: 6, name: 'in your study',
    exits: [
      { direction: 'west', destination: 9 }
    ]
  },
  {
    id: 7, name: 'in the front yard',
    exits: [
      { direction: 'north', destination: 9 },
      { direction: 'west', destination: 3 }
    ]
  },
  {
    id: 8, name: 'in the back yard',
    exits: [
      { direction: 'south', destination: 2 },
      { direction: 'west', destination: 3 }
    ]
  },
  {
    id: 9, name: 'in the entryway',
    exits: [
      { direction: 'north', destination: 10 },
      { direction: 'south', destination: 7 },
      { direction: 'east', destination: 6 },
      { direction: 'west', destination: 1 }
    ]
  },
  {
    id: 10, name: 'in the hallway',
    exits: [
      { direction: 'north', destination: 5 },
      { direction: 'south', destination: 9 },
      { direction: 'east', destination: 4 },
      { direction: 'west', destination: 2 }
    ]
  }
];