'strict';
const main = () => {
    const quick = document.getElementsByClassName('quick');
    console.log (quick[0])
}

document.addEventListener('readystatechange', state => {
    if (document.readyState==='complete') main();
})