import {makeShareableSvg, svgToPngFile} from './convert';

export const sharePng = (doodle, settings) =>
  svgToPngFile(makeShareableSvg(doodle, settings))
    .then(file =>
      // TODO: if (navigator.canShare && navigator.canShare({files: [file...
      navigator.share({
        url: window.location.href,
        title: '',
        text: '',
        files: [file],
      }),
    )
    .catch(e => console.error('Error sharing', e));
