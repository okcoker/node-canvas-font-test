const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');

/* GET home page. */
router.get('/', function(req, res, next) {
    let extension = 'ttf';
    if (process.platform === 'darwin') {
        extension = 'otf';
    }

    const fonts = [
        {
            name: 'Oswald',
            src: path.join(__dirname, `../public/fonts/${extension}/oswald.${extension}`)
        },
        {
            name: 'Bree Serif',
            src: path.join(__dirname, `../public/fonts/${extension}/bree-serif.${extension}`)
        }
    ];

    const fontHeight = 70;
    const padding = 10;
    const height = fonts.length * (fontHeight + padding);
    const notFound = [];

    fonts.forEach((font) => {
        if (!fs.statSync(font.src).isFile()) {
            notFound.push(font);
            return;
        }

        Canvas.registerFont(font.src, {
            family: font.name
        });
    });

    if (notFound.length) {
        // Just use first font that isn't found
        const font = notFound[0];
        res.send(`${font.name} doesn't exist at ${font.src}`);
        return;
    }

    const canvas = new Canvas(700, height);
    const ctx = canvas.getContext('2d');

    fonts.forEach((font, i) => {
        const y = (fontHeight * (i + 1)) + (padding * i);
        ctx.font = `50px "${font.name}"`;
        ctx.fillText(`Rendered with font: ${font.name}`, 0, y);
    });

    canvas.toDataURL('image/png', function(err, png) {
        if (err) {
            res.send(err);
            return;
        }

        res.render('index', {
            title: 'Node Canvas#registerFont test',
            image: png
        });

    });
});

module.exports = router;
