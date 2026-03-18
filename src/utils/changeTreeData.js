
export function addData(arr, obj) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].id == obj.deptId) {
			obj.label = obj.nickName;
			arr[i].children = arr[i].children || [];
			arr[i].children.push(obj)
		} else {
			if (arr[i].children && arr[i].children.length > 0) {
				addData(arr[i].children, obj)
			}
		}
	}
}

// 递归查看是否存在数据
function findElement(array) {
	let found = false;
	array.some(item => {
		if (Array.isArray(item.children)) {
			found = findElement(item.children); // 递归调用
		} else {
			found = !item.id && !item.children;
		}
		return found; // 如果找到值，中断遍历
	});
	return found;
}

// 递归删除不存在数据得对象
export function changedata(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children && arr[i].children.length > 0) {
			if (!findElement(arr[i].children)) {
				arr.splice(i, 1);
				i--;
			} else {
				changedata(arr[i].children)
			}
		} else {
			if (arr[i].id) {
				arr.splice(i, 1);
				i--;
			}
		}
	}

}

// 递归得到数组最下层数据得ID集合
export function getIdArr(arr) {
	let ids = [];

	function traverse(nodes) {
		nodes.forEach(node => {
			if (Array.isArray(node.child) && node.child.length > 0) {
				// 如果节点有子节点，则递归遍历子节点
				traverse(node.child);
			} else {
				// 如果节点没有子节点，则收集其ID
				ids.push(node.authCode);
			}
		});
	}

	traverse(arr);
	return ids;
}
// 查看原数组和权限数组得对应关系   参数：权限数组，原数组得id
export function getOneIdArr(nodes,id){
	let arr = nodes.map(item=>item.authCode)
	return arr.includes(id);
}

// 给数组排序  参数：原数组，权限数组
export function sortArr(nodes,nodes1){
	nodes.sort((a, b) => {
	  if (getOneIdArr(nodes1,a.authCode) && !getOneIdArr(nodes1,b.authCode)) {
	    return -1; // a在前
	  }
	  if (!getOneIdArr(nodes1,a.authCode) && getOneIdArr(nodes1,b.authCode)) {
	    return 1; // b在前
	  }
	  return 0; // 顺序不变
	});
}

//树结构数据筛选
export function filterTreeData(tree,val,key){
	const arr =JSON.parse(JSON.stringify(tree))
	function filterLeaf(node,str,keys){
		
		node.isHeightLight = false
		if(node[keys].trim().toLowerCase().includes(str.trim().toLowerCase())){
			node.isHeightLight = true
		}
		if(node.children?.length>0){
			node.children.forEach(child =>{
				filterLeaf(child,str,keys)
			})
		}
		
		
	}
	arr.forEach(node => filterLeaf(node,val,key))
	return arr
}

//树结构增加参数
export function addIsLeaf(nodes) {
	function markLeafShow(node){
		node.isLeafShow = true
		if(node.children?.length>0){
			node.children.forEach(child =>{
				markLeafShow(child)
			})
		}
	}
	nodes.forEach(node => markLeafShow(node))
}
//树结构增加参数disabled
export function addIsdisabled(nodes) {
	function markLeafShow(node){
		if(node.children?.length>0){
			node.isDisabled = true
			node.children.forEach(child =>{
				markLeafShow(child)
			})
		}else{
			node.isDisabled = false	
		}
	}
	nodes.forEach(node => markLeafShow(node))
}
//树结构一键展开收起
export function traverseTree(tree,isExpanded){
	const arr =JSON.parse(JSON.stringify(tree))
	function traverseLeaf(node,isExpanded){
		node.showChild = isExpanded;
		if(node.children && node.children.length >0){
			traverseLeaf(node.children,isExpanded)
		}
	}
	arr.forEach(node => traverseLeaf(node,isExpanded))
	return arr
}