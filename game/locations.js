export default [
  {
    id: 1, name: 'in your living room',
    state: {
      exits: [
        { direction: 'north', destination: 4 },
        { direction: 'south', destination: 3 },
        { direction: 'east', destination: 2 }
      ]
    }
  },
  {
    id: 2, name: 'in the kitchen',
    state: {
      exits: [
        { direction: 'west', destination: 1 }
      ]
    }
  },
  {
    id: 3, name: 'in the library',
    state: {
      exits: [
        { direction: 'north', destination: 1 }
      ]
    }
  },
  {
    id: 4, name: 'in the front yard',
    state: {
      exits: [
        { direction: 'south', destination: 1 },
        { direction: 'west', destination: 5 }
      ]
    }
  },
  {
    id: 5, name: 'in the garage',
    state: {
      exits: [
        { direction: 'east', destination: 4 }
      ]
    }
  },
  {
    id: 6, name: 'in an open field'
  },
  {
    id: 7, name: 'at the edge of a forest'
  },
  {
    id: 8, name: 'on a branch of a tree'
  },
  {
    id: 9, name: 'on a long, winding road'
  },
  {
    id: 10, name: 'on a long, widing road'
  },
  {
    id: 11, name: 'on a long, winding road'
  },
  {
    id: 12, name: 'on the south bank of a river'
  },
  {
    id: 13, name: 'inside a wooden boat'
  },
  {
    id: 14, name: 'on the north bank of a river'
  },
  {
    id: 15, name: 'on a well-traveled road'
  },
  {
    id: 16, name: 'in front of a large castle'
  },
  {
    id: 17, name: 'in a narrow hall'
  },
  {
    id: 18, name: 'in a large hall'
  },
  {
    id: 19, name: 'at the top of a tree'
  }
]