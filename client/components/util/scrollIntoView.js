const defaultOptions = {
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
};
export default function(element, options = defaultOptions) {
    if (element) {
        element.scrollIntoView(
            Object.assign({}, defaultOptions, options)
        );
    }
}
