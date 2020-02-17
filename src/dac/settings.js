import storable from '../lib/storable';

const store = storable('settings', {
  size: [6, 6],
  // * inner radius of dot
  rDot: (2 / 100) * 5,
  // * outer radius of dot
  rHot: (5 / 100) * 5,
});

export default {
  store,

  setSize: size => store.update(v => ({...v, size})),
};
