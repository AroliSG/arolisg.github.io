

let interval;
let frames = 0;
let animations      = 0;

let rot = {
    0: 'translate(-25%,50%)',
    1: 'translate(25%,-50%)',
    2: 'translate(0%,100%)',
    3: 'translate(0%,-100%)',
    4: 'translate(25%,50%)',
    5: 'translate(-25%,-50%)',
    6: 'translate(0%,0%)',
    7: 'translate(0%,0%)'
}


function createElement (
    tag,
    preferences,
    children
) {
    const elements = document.createElement(tag);
    if(preferences) for(let name in preferences){
            // text content
        if (name === 'textContent') elements[name] = preferences[name];

        elements.setAttribute(name, preferences[name]);
    }

    if (!children || children.length === 0) return elements;
    else {
            // adding children
        for(let i = 0; i < children.length; i++) elements.appendChild(children [i]);
        return elements;
    }
}
