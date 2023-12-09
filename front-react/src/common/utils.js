export function Fetch(ops) {
    const { url } = ops
    return window.fetch(url)
        .then((response) => response.json())
        .then((data) => data);
}