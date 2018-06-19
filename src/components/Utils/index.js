export function dragHandlerSizing(ref) {
  const { left } = ref.getBoundingClientRect();
  ref.style.left = left;
  ref.style.top = 0;
  ref.style.bottom = 0;
  ref.style.position = 'fixed';

  return ref;
}
