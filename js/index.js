'strict';

const open = (link) => window.open(link);
const main = async () => {
    const repos = document.querySelector('#repos');
    const res = await axios('https://api.github.com/users/AroliSG/repos?sort=created');

    let lastIdInput     = 0;
    let oldScrollY      = 0;

    const controlDirection = () => {
        let dir = 0;
        if(window.scrollY > oldScrollY) dir = 0;
        else dir = 1;

        oldScrollY = window.scrollY;

        return dir;
    }

    function Items(repo) {
        return new Promise (async (resolve, reject) => {
            let res_languages = await (await axios(repo.languages_url)).data;
            if(res_languages) res_languages = Object.keys(res_languages).toString();

            let assignToFirst         = null;
            let assignToSecond        = null;

            let assignStyleToFirst    = 'background-color: var(--background);';
            let assignStyleToSecond   = 'background-color: transparent;';
            let aimToFirst             = "right";
            let aimToSecond            = null;

            const items_children = [
                createElement('p', { class: 'repos-name', textContent: repo.name }),
                createElement('p', { class: 'repos-body',textContent: repo.description }),
                createElement('i', { class: 'fa fa-github', style:'color:white;font-size:35px;margin-top:30px', onclick:`open("${repo.html_url}");` }),
                createElement('div', { class: 'repos-body', style: 'width:50%;display:flex;position:absolute;bottom:0;justify-content:space-evenly;margin:15px;'}, [
                    createElement('div', { class: 'repos-body', style: 'display:flex;color:white;font-size:30px;align-items:center;'}, [
                        createElement('i', { class: 'fa fa-star', style:'font-size:20px;'}),
                        createElement('p', { class: 'repos-name', textContent: repo.stargazers_count })
                    ]),
                    createElement('div', { class: 'repos-body', style: 'display:flex;color:gray;align-items:center;'}, [
                        createElement('p', { class: 'repos-name', textContent: res_languages, style:'font-size:15px;'})
                    ]),
                    createElement('div', { class: 'repos-body', style: 'display:flex;color:white;font-size:30px;align-items:center;'}, [
                        createElement('i', { class: 'fa fa-code-fork', style:'font-size:20px;'}),
                        createElement('p', { class: 'repos-name', textContent: repo.forks })
                    ]),
                ])
            ]

            if (lastIdInput === 0) {
                    // assigning to which box should children go
                assignToFirst           = items_children;
                assignToSecond          = null;

                    // boxes color
                assignStyleToFirst      = 'background-color: var(--background);';
                assignStyleToSecond     = 'background-color: transparent;';

                    // direction in which box should go
                aimToFirst             = null;
                aimToSecond            = "left";

                    // identifier
                lastIdInput = 1;
            }
            else {
                    // assigning to which box should children go
                assignToFirst           = null;
                assignToSecond          = items_children;

                    // boxes color
                assignStyleToFirst      = 'background-color: transparent;';
                assignStyleToSecond     = 'background-color: var(--background);';

                    // direction in which box should go
                aimToFirst             = "right";
                aimToSecond            = null;

                    // identifier
                lastIdInput = 0;
            }


            const element = createElement('div', {class:'boxes'}, [
                createElement('div', {class:'boxes-items', style:assignStyleToFirst, 'data-aims':aimToFirst}, assignToFirst),
                createElement('div', {class:'boxes-items', style:assignStyleToSecond, 'data-aims':aimToSecond}, assignToSecond)
            ]);

            resolve (element);
        })
    }
    res.data.forEach (async repo => {
        const elements = await Items (repo);
        repos.appendChild(elements);
    });

        // scroll animations
        // repos https://github.com/AroliSG/50projects-in-10days/blob/main/50projects/scrollanimation.tsx
    const body              = document.querySelector ('body');
    const repos_line        = document.getElementsByClassName ('repos_line');
    const loader            = document.getElementsByClassName ('loader');
    const element           = document.getElementsByClassName ('boxes');
    const height            = window.innerHeight;
    const offset            = 25;


    const onScroll = (evt) => {
        const aim = controlDirection ();

        for (let i = 0; i < element.length; i++) {
            const child             = element[i].children;
            const boxes             = element[i].getBoundingClientRect ();
            const aims              = child[0].dataset.aims === "null" ? child[1].dataset.aims : child[0].dataset.aims;

            let aimPos = "-" + (height*2);


            if (repos_line[0].children.length <= element.length) {
                let circle_creator = createElement('div', { class: 'repos-circle' });
                circle_creator.style.top = i == 0 ? 0 : ((300+offset)*i) + 'px';

                repos_line[0].appendChild (circle_creator);
            }

                // changing direction of the boxes
            if (aims === 'right') aimPos = (height*2).toString ();

                // scrolling down
            if (aim === 0) {
                    // translating to the sides
                if(boxes.top > height) element[i].style.transform = `translateX(${aimPos}px)`;

                    // translating to the middle
                else element[i].style.transform = `translateX(0px)`;
            }

                // scrolling up
            if (aim === 1) {
                    // translating to the sides
                if(boxes.bottom > height) element[i].style.transform = `translateX(${aimPos}px)`;

                    // translating to the middle
                else element[i].style.transform = `translateX(0px)`;
            }
        }
    }

    const moveIt = (element, rot) => {
        const rotation = parseInt (element.style.rotate, 10);
        const deg = isNaN(rotation) ? 0 : rotation;

        element.style.rotate       = `${deg + 90}deg`;
        element.style.transform    = rot;

        animations += 1;
        if (animations > 7) animations =0 ;
    }

        // https://github.com/AroliSG/50projects-in-10days/blob/main/50projects/kineticloader.tsx
    const startKinetic = () => {
        let target          = 0;
        const elements      = document.getElementsByClassName ('triangles');

        interval = setInterval (() => {
                // updating triangles every 5 frames
            if (frames%5===0) {
                    /*
                        @{target}
                        target to be used, we have 2 targets 0 and 1
                        which are the 2 triangles
                    */
                if (target === 0) target = 1;
                else target = 0;

                    /*
                        @{moveIt}
                        moving the triangle to the desire position
                    */
                moveIt (elements[target], rot[animations]);
            }
            frames++;
        },50);
    }
        // starting loader
    startKinetic()

        // deleting loader
        // removing
    setTimeout (() => {
        body.style.overflowY = 'scroll';
        loader[0].style.display = 'none';
        clearInterval (interval);
    },7000);

    onScroll ();
    window.addEventListener('scroll', onScroll);
}

document.addEventListener('readystatechange', state => {
    if (document.readyState==='complete') main();
})