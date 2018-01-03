export default [
  {
    id: 1,
    name: 'an old journal',
    tag: 'journal',
    identity: {
      
    },
    state: {
      room: 1
    }
  },
  {
    id: 2,
    name: 'a small wooden box',
    tag: 'box',
    state: {
      room: 1,
      containsObjects: [ 3, 4 ]
    }
  },
  {
    id: 3,
    name: 'a small bottle',
    tag: 'bottle',
    identity: {
      label: `Formula 413
Dilute heavily before use!
Do not dilute with hard water!`,
      description: `The bottle appears to be hand labeled and contains a reddish liquid.`
    }
  },
  {
    id: 4,
    name: 'a small note',
    tag: 'note',
    identity: {
      text: `Nephew--
  Use sodium acetate as a catalyst
      -- Your Uncle Simon`
    }
  }
]