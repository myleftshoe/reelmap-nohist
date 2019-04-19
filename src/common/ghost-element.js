import { theme } from "./constants";

export default function createGhostElement({ target, width, height, badgeContent }) {

    const text = target.textContent || target.innerText;

    const baseCss = `
        width:${width}px;
        border: 1px solid black;
        border-radius: 3px;
        position: absolute;
        z-index: -1;
    `

    const ghostCss = `
        ${baseCss}
        padding: 1px 1px;
        background-color: ${theme.searchHighlightColor};
    `

    let crt = document.createElement('div');
    crt.style.cssText = `
        ${ghostCss}
        height:${height - 1}px;
    `

    const crt2 = document.createElement('div');
    crt2.style.cssText = `
        ${ghostCss}
        height:${height}px;
    `

    const crt3 = document.createElement('div');
    crt3.style.cssText = `
        ${ghostCss}
        height:${height + 1}px;
    `

    const crt4 = document.createElement('div');
    crt4.style.cssText = `
        ${baseCss}
        display:flex;
        align-items:center;
        justify-content: center;
        height: ${height}px;
        color: black;
        font-weight: 700;
        background-color:${theme.searchHighlightColor};
        padding: 2px 0px;
    `

    const badge = document.createElement('span');
    badge.style.cssText = `
        min-width:1.2ch;
        padding-left: 1ch;
        padding-right: 1ch;
        padding-bottom: 3px;
        padding-top: 2px;
        border-radius: .64rem;
        font-size: .64rem;
        font-weight:500;
        text-align: center;
        vertical-align: middle;
        background-color:#a00;
        color:white;
        top:-10px;
        right: -10px;
        position: absolute;
        z-index: -1;
    `

    if (badgeContent) {
        crt.appendChild(crt2)
        crt2.appendChild(crt3)
        crt3.appendChild(crt4)
        crt4.appendChild(document.createTextNode(`${text}`))
        badge.appendChild(document.createTextNode(`${badgeContent}`))
        crt4.appendChild(badge)
    }
    else {
        crt = crt4;
        crt.appendChild(document.createTextNode(`${text}`))
    }

    target.parentNode.appendChild(crt);

    setTimeout(() => crt.parentNode.removeChild(crt), 0);

    return crt;

}
