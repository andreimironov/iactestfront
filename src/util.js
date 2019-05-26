export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 b';
    const kb = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
    const i = Math.floor(Math.log(bytes) / Math.log(kb));
    return parseFloat((bytes / Math.pow(kb, i)).toFixed(dm)) + ' ' + sizes[i];
}