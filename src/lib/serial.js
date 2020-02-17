const packPair = ([a, b]) => (a << 4) | b;
const unpackPair = pack => [pack >> 4, pack & 0xf];

const stringifiers = {
  size: v => 's' + packPair(v),
  line: v =>
    'l' +
    btoa(
      v
        .map(point => packPair(point))
        .map(p => String.fromCharCode(p))
        .join(''),
    ),
  createdAt: v => 't' + new Date(v).getTime(),
};

const stringify = doodle =>
  Object.entries(doodle)
    .filter(([key]) => Object.keys(stringifiers).includes(key))
    .map(([key, value]) => stringifiers[key](value))
    .join(';');

const parsers = {
  s: str => ({size: unpackPair(str).join(',') === '6,6' ? [6, 6] : [5, 5]}),
  l: str => ({
    line: atob(str)
      .split('')
      .map(x => x.charCodeAt(0))
      .map(p => unpackPair(p))

      .filter(point =>
        // magic number 6: max size. This check belongs somewhere where size is known
        point.every(a => !isNaN(a) && a <= 6 && a >= 0),
      ),
  }),
  t: str => ({createdAt: new Date(Number(str))}),
};

//# parse :: hash -> doodle
//.
//. Turn a hash (from stringify above) into a doodle.
//. Unsafe: May throw an unknown variety of errors
//. XXX This needs tests!
const parse = hash =>
  hash
    .split(';')
    .map(x => parsers[x[0]](x.substr(1)))
    .reduce((acc, cur) => ({...acc, ...cur}), {});

//# doodleFromHash :: (doodles, hash) => doodle
//.
//. Returns a doodle or undefined if a parsing error occurs.
//. Will set doodle.id if it finds an existing doodle with the exact same
//. size and line
const doodleFromHash = (doodles, hash) => {
  debugger
  try {
    const hashDoodle = parse(hash);
    const existing = doodles.items.find(
      doodle =>
        doodle.size.every((a, i) => a === hashDoodle.size[i]) &&
        doodle.line.every((point, i) =>
          point.every((a, j) => a === hashDoodle.line[i][j]),
        ),
    );
    return existing || hashDoodle;
  } catch (e) {
    console.error('Cannot parse hash', hash, e);
  }
};

export default {stringify, doodleFromHash};
