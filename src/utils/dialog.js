export function popDialogResult(ret, msgFunc) {
  let type = 'success'
  if (ret.code !== 0) {
    type = 'warn'
  }
  msgFunc({
    message: ret.msg,
    type: type
  })
}
