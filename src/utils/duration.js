export default function Duration(seconds) {
    const _seconds = seconds;
    return {
        format({ fmt = '{hh}:{mm}', fallback = '-' } = {}) {
            const m = _seconds / 3600;
            const hh = Math.floor(m);
            const mm = Math.round((m % 1) * 60);
            if (!Number.isInteger(hh) || !Number.isInteger(mm)) return fallback;
            return fmt.replace('{hh}', hh.toString().padStart(2, '0')).replace('{mm}', mm.toString().padStart(2, '0'));
        },
        get hour() { return Math.trunc(_seconds / 3600) },
        get seconds() { return _seconds }
    }
}

Duration.from = (str, separator = ':') => {
    const [hh, mm, ss = 0] = str.split(separator);
    const seconds = 60 * (60 * Number(hh) + Number(mm)) + Number(ss);
    return Duration(seconds);
}
