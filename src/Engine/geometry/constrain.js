function constrain(src, dst) {
  const rw = dst.width / src.width
  const rh = dst.height / src.height
  let nw = src.width
  let nh = src.height

  let fr = rw
  if (rw > rh) {
    fr = rh
  }
  nw = src.width * fr
  nh = src.height * fr
  return { width: nw, height: nh }
}

export { constrain }
