// report.mjs
import { readFile } from 'fs';
import { parse } from 'csv-parse';
import { rowsToObjects } from './hoffy.mjs';
import * as sfmovie from './sfmovie.mjs';
import { RootElement, RectangleElement, TextElement } from './drawing.mjs';

readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
        console.log('Error reading file:', err);
        return;
    }
    parse(data, (err, rows) => {
        if (err) {
            console.log('Error parsing file:', err);
            return;
        }
        const parsed = rowsToObjects({headers: rows[0], rows: rows});
        parsed.shift();
        console.log(sfmovie.longestFunFact(parsed));
        console.log(sfmovie.getTitlesByYear(parsed, 2023));
        let actors = sfmovie.actorCounts(parsed);
        actors = Object.entries(actors);
        actors.sort((a, b) => {
            if (a[1] === b[1]) { return 0; }
            return a[1] > b[1] ? -1 : 1;
        });
        actors = actors.slice(0, 3);
        console.log(actors);
        const svg = new RootElement();
        svg.addChild(new RectangleElement(0, 0, 100, actors[0][1], 'blue'));
        svg.addChild(new RectangleElement(250, 0, 100, actors[1][1], 'yellow'));
        svg.addChild(new RectangleElement(500, 0, 100, actors[2][1], 'black'));
        svg.addChild(new TextElement(0, 250, 20, 'black', actors[0].toString()));
        svg.addChild(new TextElement(250, 250, 20, 'black', actors[1].toString()));
        svg.addChild(new TextElement(500, 250, 20, 'black', actors[2].toString()));
        svg.write('actors.svg', () => {});
    });
});