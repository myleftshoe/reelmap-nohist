export default function formattedDuration(seconds) {
    const m = seconds / 3600;
    const hh = Math.floor(m);
    const mm = Math.round((m % 1) * 60);
    return `${hh}h ${mm}m`;
};