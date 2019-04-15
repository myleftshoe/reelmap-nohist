// Generates consecutive integers between start and end inclusive
// Example: const arr = [...range(5,9)]
// Result: arr = [5, 6, 7, 8, 9]
export default function* range(start, end) {
    yield start;
    if (start === end) return;
    yield* range(start + 1, end);
}