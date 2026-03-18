export const handleTreeData = async (params) => {
  let paramsObj = params ? params : {};
  let res = await treeData(paramsObj);
  if (res.success) {
    return res.data;
  }
};

//树结构增加参数disabled
export function addIsdisabled(nodes, type) {
  function markLeafShow(node) {
    if (node.children && node.children.length > 0) {
      node.disabled = node.type == type ? false : true;
      node.children.forEach((child) => {
        markLeafShow(child);
      });
    } else {
      node.disabled = node.type == type ? false : true;
    }
  }
  nodes.forEach((node) => markLeafShow(node));
  return nodes;
}

export function findNodeByKey(tree, id) {
  let nodeObj = null;
  function findNode(node) {
    if (node.id == id) {
      nodeObj = node;
      return;
    } else {
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          findNode(child);
        });
      }
    }
  }
  tree.forEach((node) => findNode(node));
  return nodeObj;
}
