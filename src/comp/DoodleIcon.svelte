<script context="module">
  const shapes = {
    fullscreenOff: {
      size: [6, 6],
      polyline: '1,2 0,0 2,1 2,2 1,2 2,2 3,3 3,4 5,5 4,3 3,3',
    },
    fullscreenOn: {
      size: [6, 6],
      polyline: '2,2 0,1 0,0 1,0 2,2 3,3 4,5 5,5 5,4 3,3',
    },

    five: {
      size: [5, 5],
      polyline: '2,1 1,1 1,2 2,2 2,3 1,3',
    },

    six: {
      size: [5, 5],
      polyline: '2,1 1,1 1,2 2,2 2,3 1,3 1,2',
    },

    sharex: {
      size: [5, 5],
      polyline:
        '0,2 1,1 2,2 3,1 3,0 4,0 4,1 3,1 2,2 3,3 4,3 4,4 3,4 3,3 2,2 1,3 0,2',
    },

    sharey: {
      size: [5, 5],
      polyline: '4,0 2,1 0,2 0,3 1,3 2,2 3,1 4,0 3,2 2,4 1,4 1,3',
    },
    share: {
      size: [6, 6],
      polyline: '4,1 2,2 0,3 0,4 1,4 2,3 3,2 4,1 3,3 2,5 1,5 1,4',
    },

    discard: {
      size: [5, 5],
      polyline: '1,1 2,2 3,3 2,2 1,3 2,2 3,1',
    },

    keep: {
      size: [5, 5],
      polyline: '1,2 2,3 3,2 4,1',
    },

    infox: {
      size: [5, 5],
      polyline: '2,0 1,0 1,1 2,2 2,3 2,4 1,4 1,3 1,2 2,1 2,0',
    },
    info: {
      size: [6, 6],
      polyline: '3,1 2,1 2,2 3,3 3,4 3,5 2,5 2,4 2,3 3,2 3,1',
    },

    quest: {
      size: [5, 5],
      polyline: '1,2 1,1 2,1 3,1 3,2 2,3 2,4',
    },

    wasp: {
      size: [6, 6],
      polyline:
        '4,1 5,2 5,1 4,1 3,1 2,2 3,2 4,1 3,2 2,2 3,3 5,4 3,3 2,2 2,3 3,4 2,3 2,2 1,3 1,4 1,3 2,2 1,2 0,1 1,1 2,2',
    },

    home: {
      size: [5, 5],
      polyline: '3,4 2,4 1,4 1,3 1,2 2,1 3,2 2,2 1,2 2,3 3,4 3,3 3,2 2,3 1,4',
    },

    update: {
      size: [5, 5],
      polyline:
        '2,2 1,2 0,2 0,3 0,4 1,4 2,4 2,3 2,2 2,3 2,2 3,2 4,2 4,3 4,4 3,4 2,4 3,4 4,4 0,2 0,3 0,4 4,2 3,2 2,2 3,1 4,1 2,2 1,1 0,1 2,2',
    },

    copy: {
      size: [6, 6],
      polyline: '2,3 1,3 1,2 1,1 2,1 3,1 3,2 2,2 2,3 2,4 3,4 4,4 4,3 4,2 3,2',
    },
  };
</script>

<script>
  export let shape;
  let className = '';
  export {className as class};
</script>

<style>
  svg {
    @apply stroke-current;
  }
</style>

<svg
  class="{className}"
  class:h-full="{!className}"
  viewBox="0 0 {shapes[shape].size.join(' ')}">
  <g class="" transform="translate(0.5, 0.5)">
    <polyline points="{shapes[shape].polyline}"></polyline>
  </g>
</svg>
