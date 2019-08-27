const increment = state => state + 1;
const decrement = state => state - 1;
const modifyValue = (state, fn) => fn(state);
const setValue = state => state;

export { increment, decrement, setValue, modifyValue };
