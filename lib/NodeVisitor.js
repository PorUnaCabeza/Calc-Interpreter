class NodeVisitor {
  //递归后续遍历
  recursionPostorder(root, callback) {
    if (!root) {
      return
    }
    this.recursionPostorder(root.left, callback)
    this.recursionPostorder(root.right, callback)
    callback && callback(root.token)
  }

  //非递归后续遍历
  postorder(root, callback) {
    let stack = []
    let node = root
    let lastVisit = root
    while (node || stack.length > 0) {
      while (node) {
        stack.push(node)
        node = node.left
      }
      node = stack[stack.length - 1] //peek
      if (!node.right || node.right === lastVisit) {
        callback(node.token)
        stack.pop()
        lastVisit = node
        node = null
      } else {
        node = node.right
      }
    }
  }
}

module.exports = {
  NodeVisitor
}
