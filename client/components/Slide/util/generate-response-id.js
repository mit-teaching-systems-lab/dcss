let increment = 1;
export default function(prefix) {
    return `${prefix}-${Date.now()}${increment++}`;
}
