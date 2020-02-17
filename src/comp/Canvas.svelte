<script>
  import {createEventDispatcher} from 'svelte';
  import {
    makeGetCursorPoint,
    polyline,
    distance,
    isSamePoint,
    isButtonDownOrTouch,
  } from '../lib/util.js';
  import {settingsService} from '../dac';

  const dispatch = createEventDispatcher();
  const settings = settingsService.store;

  let dragPos = null;
  let hover = null;
  let line = [];
  let svgRef;
  let elevate = false;
  $: getCursorPoint = svgRef ? (evt => makeGetCursorPoint(svgRef)([evt.clientX, evt.clientY])) : () => {};

  export const clear = () => {
    line = [];
    elevate = false;
  };

  export const showDoodle = doodle => {
    settingsService.setSize(doodle.size || [5, 5]);
    line = doodle.line;
    elevate = true;
  };

  const isOutOfCanvas = cp => cp.some((a, i) => a < 0 || a > $settings.size[i]);

  const onDown = evt => {
    if (evt.buttons || evt.touches.length === 1) {
      if (elevate) {
        dispatch('done', line);
      }
      line = [];
      elevate = false;
    }
  };

  const onMove = evt => {
    if (elevate) {
      return;
    }

    const cp = getCursorPoint(evt.touches ? evt.touches[0] : evt);
    if (isOutOfCanvas(cp)) {
      return;
    }

    dragPos = cp.map(a => a - $settings.rHot * 2);

    const overCell = cp.map(Math.floor);

    if (distance(dragPos, overCell) > $settings.rHot) {
      hover = null;
    } else {
      hover = overCell;
      if (
        isButtonDownOrTouch(evt) &&
        (!line.length || !isSamePoint(hover, line[line.length - 1]))
      ) {
        line = [...line, hover];
      }
    }
  };

  const onUp = evt => {
    if (!(evt.touches && evt.touches.length)) {
      hover = null;

      if (line.length > 1) {
        elevate = true;
        dispatch('elevate', line);
      } else {
        line = [];
      }
    }
  };
</script>

<style>
  circle {
    @apply text-gray-500;
  }
  circle.hover {
    fill: red;
  }
  circle.hotspot {
    @apply text-gray-400;
    opacity: 0.2;
  }

  .grid,
  .doodle {
    opacity: 1;
    transform-origin: center;
    transition-property: transform, stroke;
    transition-duration: 0.5s;
  }

  .elevate .doodle {
    transform: scale(1.1);
  }
  .elevate polyline {
    stroke: red;
    stroke-width: 0.3;
  }

  .elevate .grid {
    transform: scale(0.9);
    opacity: 0.1;
  }

  svg {
    max-height: calc(100vh - 8rem);
  }
</style>

<svg
  class="w-full h-full bg-black fill-current"
  class:elevate
  viewbox="0 0 {$settings.size.join(' ')}"
  bind:this="{svgRef}"
  on:touchstart|preventDefault="{onDown}"
  on:touchmove|preventDefault="{onMove}"
  on:touchend="{onUp}"
  on:mousemove|preventDefault="{onMove}"
  on:mousedown|preventDefault="{onDown}"
  on:mouseup="{onUp}">

  <rect
    x="0"
    y="0"
    width="{$settings.size[0]}"
    height="{$settings.size[1]}"
    style="fill: transparent; stroke: black; stroke-width: 0.025; "></rect>

  <g class="" transform="translate({$settings.rHot * 2}, {$settings.rHot * 2})">
    <g class="doodle">
      <polyline
        points="
        {polyline(line)}
        {!elevate && dragPos ? dragPos.join(',') : ''}
        "></polyline>
    </g>
    <g class="grid">
      {#each Array($settings.size[0]) as _, iDotX}
        {#each Array($settings.size[1]) as _, iDotY}
          <circle
            class="hotspot"
            cx="{iDotX}"
            cy="{iDotY}"
            r="{$settings.rHot}"></circle>
          <circle
            class="text-gray-400"
            class:hover="{hover && hover[0] === iDotX && hover[1] === iDotY}"
            cx="{iDotX}"
            cy="{iDotY}"
            r="{$settings.rDot}"></circle>
        {/each}
      {/each}
    </g>
  </g>
</svg>
