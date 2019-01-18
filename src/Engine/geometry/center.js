function center(src, dst) {
  return {
    xOffset: (dst.width - src.width) / 2,
    yOffset: (dst.height - src.height) / 2,
  }
}

export { center }
