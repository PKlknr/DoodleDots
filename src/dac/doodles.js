import storable from '../lib/storable';
import initialDoodles from './initialDoodles';

const store = storable('doodles-v2', initialDoodles);

let currentDoodles;
store.subscribe(v => (currentDoodles = v));

export default {
  store,

  create: (line, size, createdAt) => {
    const id = currentDoodles.newId;

    store.update(v => ({
      newId: id + 1,
      items: [
        {
          id,
          size,
          line,
          createdAt: createdAt || new Date().toISOString(),
        },
        ...v.items,
      ],
    }));
  },

  remove: id =>
    store.update(v => ({
      ...v,
      items: v.items.filter(x => x.id !== id),
    })),
};
