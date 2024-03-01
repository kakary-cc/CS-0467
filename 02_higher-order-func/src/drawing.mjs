// drawing.js
import { writeFile } from 'fs';

class RootElement {
    xmlns = 'http://www.w3.org/2000/svg';
    name = 'svg';
    addAttr(name, value) {
        this[name] = value;
    }
    setAttr(name, value) {
        this[name] = value;
    }
    addAttrs(obj) {
        Object.keys(obj).filter((key) => { this[key] = obj[key]; });
    }
    removeAttrs(arr) {
        arr.filter((key) => {
            if (Object.hasOwn(this, key)) {
                delete this[key];
            }
        });
    }
    addChild(child) {
        if (Object.hasOwn(this, 'child')) {
            this.child.push(child);
        }
        else {
            this.child = [];
            this.child.push(child);
        }
    }
    toString() {
        let str = `<${this.name}`;
        const keys = Object.keys(this);
        keys.filter((key) => {
            if (key !== 'child' && key !== 'name') {
                str += ` ${key}="${this[key]}"`;
            }
        });
        str += `>\n`;
        if (Object.hasOwn(this, 'child')) {
            for (const child of this.child) {
                str += child.toString() + '\n';
            }
        }
        str += `</${this.name}>`;
        return str;
    }
    write(fileName, cb) {
        writeFile(fileName, this.toString(), cb);
    }
}

class GenericElement extends RootElement {
   constructor(name) {
    super();
    delete this.xmlns;
    this.name = name;
   }
}

class RectangleElement extends GenericElement {
   constructor(x, y, width, height, fill) {
    super('rect');
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
   }
}

class TextElement extends GenericElement {
    constructor(x, y, fontSize, fill, content) {
        super('text');
        this.x = x;
        this.y = y;
        this['font-size'] = fontSize;
        this.fill = fill;
        this.content = content;
    }
    toString() {
        let str = `<${this.name}`;
        const keys = Object.keys(this);
        keys.filter((key) => {
            if (key !== 'content' && key !== 'name') {
                str += ` ${key}="${this[key]}"`;
            }
        });
        str += `>${this.content}\n</${this.name}>`;
        return str;
    }
}

export {
    RootElement,
    GenericElement,
    RectangleElement,
    TextElement
};

// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({width: 800, height: 170, abc: 200, def: 400});
root.removeAttrs(['abc','def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({'cx': 200, 'cy': 80});
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));