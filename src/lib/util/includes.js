export default (array, ele) => {
  return array.some(element => {
    element === ele
  })
}