export default function Duration(seconds) {
    return {
        format({ fmt = '{hh}:{mm}', fallback = '-' } = {}) {
            const m = seconds / 3600;
            const hh = Math.floor(m);
            const mm = Math.floor((m % 1) * 60);
            if (!Number.isInteger(hh) || !Number.isInteger(mm)) return fallback;
            return fmt.replace('{hh}', hh).replace('{mm}', mm.toString().padStart(2, '0'));
        },
        get hour() { return Math.trunc(seconds / 3600) }
    }
}


// export default function formattedDuration(seconds, format = '{hh}h{mm}m') {
//     const m = seconds / 3600;
//     const hh = Math.floor(m).toString();
//     const mm = Math.round((m % 1) * 60).toString();
//     return format.replace('{hh}', hh).replace('{mm}', mm.padStart(2, '0'));
//     // return `${hh}h ${mm}m`;
// };
