
export function circle({ radius: r = 16, color = 'black', opacity = 0.5, text = '' }) {
    const h = r * 2;
    const w = r * 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}px" height="${h}px"><circle cx="${r}" cy="${r}" r="${r}" fill="${color}" opacity="${opacity}"/><text font-family="roboto" font-size="10px" font-weight="lighter" x="50%" y="50%" text-anchor="middle" stroke="#fff" fill="#fff" dy=".3em">${text}</text></svg>`;
    const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    const cursor = `url(${url}) ${r} ${r}, auto`
    return { svg, url, cursor }
}
