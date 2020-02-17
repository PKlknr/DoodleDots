import {polyline} from './util.js';

export const makeShareableSvg = (doodle, settings) =>
  `<svg 
    version="1.1" 
    baseProfile="full" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 ${(doodle.size || [5, 5]).join(' ')}"

    >
    <g transform="translate(${settings.rHot * 2}, ${settings.rHot * 2})">
      <polyline style="fill: transparent; stroke-width: 0.2px;
                       stroke-linecap: round; stroke-linejoin: round; stroke: red;" 
        points="${polyline(doodle.line)}"></polyline></g></svg>`;

const svgStringToImg = svgString =>
  new Promise(resolve => {
    const svgUrl = URL.createObjectURL(
      new Blob([svgString], {type: 'image/svg+xml'}),
    );

    /* Download SVG:
    const element = document.createElement('a');
    element.setAttribute('href', svgUrl);
    element.setAttribute('download', 'filename.svg');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    */

    const svgImage = document.createElement('img');

    svgImage.onload = () =>
      resolve({
        svgImage,
        cleanup: () => URL.revokeObjectURL(svgUrl),
      });

    svgImage.src = svgUrl;
  });

export const svgToPngFile = svgString =>
  new Promise(resolve => {
    svgStringToImg(svgString).then(({svgImage, cleanup}) => {
      const canvas = document.createElement('canvas');
      const w = 1000;
      const h = 200;
      const margin = 5;
      const doodleH = h - margin * 2;
      const doodleW = doodleH;
      canvas.width = w;
      canvas.height = h;
      const canvasCtx = canvas.getContext('2d');
      canvasCtx.drawImage(
        svgImage,
        w / 2 - doodleW / 2,
        margin,
        doodleW,
        doodleH,
      );
      canvas.toBlob(blob => {
        const file = new File([blob], 'rick.png', {type: blob.type});
        resolve(file);
        cleanup();
      });
    });
  });
