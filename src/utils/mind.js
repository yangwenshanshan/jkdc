const colors = [
    '#2A2A2A',
    '#398D6F',
    '#43A47C',
    '#49A7B1',
    '#69B982',
    '#6DB1C6',
    '#6DBCBA',
]


/**
 * 获取标签节点上的内容
 * @param {} tags
 * @param {*} items
 */
function getTagItems(tag, items) {
    if (!tag) {
        return [];
    }
    if (tag.isTerms) {
        return items.filter((item) => {
            return (item.kstag_name || tag.ksTagNames.includes(item.kstag_name)) && item.tags?.find((t) => t.tag.id === tag.id);
        });
    }
    return items.filter((item) => {
        const xTag = item.tags?.find((t) => t.id === tag.id);
        return xTag && xTag.type === "manually";
    });
}

function buildContent(tag, items, level, expandAll) {
    if (tag.isTerms) {
        // 如果有知识结构
        if (tag?.map?.categories?.length) {
            return (tag?.map?.categories || []).map((category) => {
                const tags = (category.tags || '').split(',');
                return {
                    data: {
                        text: category.name,
                        color: '#ffffff',
                        fillColor: colors[level] || '#6DBCBA',
                        expand: expandAll,
                        customExpand: true,
                    },
                    children: tags.map((tag) => {
                        const currentItems = items.filter((item) => {
                            return item.kstag_name === tag;
                        });
                        const regulationSize = currentItems.length;
                        const termSize = currentItems.reduce((acc, item) => {
                            return acc + item.children.length;
                        }, 0);
    
                        if (regulationSize === 0) {
                            return null;
                        }
    
                        return {
                            data: {
                                isKsTag: true,
                                name: tag,
                                count: `（涉及 ${regulationSize} 个法规、${termSize} 个法条）`,
                                text: `${tag}\n（涉及 ${regulationSize} 个法规、${termSize} 个法条）` ,
                                color: '#ffffff',
                                fillColor: colors[level + 1] || '#6DBCBA'
                            },
                            children: currentItems.map((cItem) => {
                                return {
                                    data: {
                                        text: cItem.name.replace(/(.{15})/g, "$1\n"),
                                        isRegulation: true,
                                    },
                                    children: cItem.children.map((child) => {
                                        return {
                                            data: {
                                                id: child.id,
                                                regulation: child.regulation,
                                                text: child.content,
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }).filter(Boolean)
                }
            }).filter(v => v.children?.length);
        }

        return items.map((item) => {
            const termSize = item.children.length;
            return {
                data: {
                    isKsTag: true,
                    name: item.kstag_name,
                    count: `（涉及 1 个法规、${termSize} 个法条）`,
                    text: `${item.kstag_name}\n（涉及 1 个法规、${termSize} 个法条）` ,
                    color: '#ffffff',
                    fillColor: colors[level] || '#6DBCBA'
                },
                children: [{
                    data: {
                        text: item.name.replace(/(.{15})/g, "$1\n"),
                    },
                    children: item.children.map((child) => {
                        return {
                            data: {
                                id: child.id,
                                regulation: child.regulation,
                                text: child.content,
                            }
                        }
                    })
                }]
            }
        })
    }
    return items.map((item) => {
        return {
            data: {
                id: item.id,
                text: item.name,
                hyperlink: `/#/regulation/${item.id}`,
                borderColor: 'transparent',
            },
        }
    })
}

// 生成脑图 tree
export function generateMindTree(tags, items, options) {
    const { rootIsWrap = false, expandAll = true } = options || {};
    // console.log("generateMindTree input", tags, items, options);

    // 构建标签映射
    const tagMaps = {};
    const tagChildrenMaps = {};
    tags.forEach((tag) => {
        tagMaps[tag.id] = tag;
        const key = tag.parent_id || "root";
        if (tagChildrenMaps[key]) {
            tagChildrenMaps[key].push(tag);
        } else {
            tagChildrenMaps[key] = [tag];
        }
    });

    // 构建内容映射, id -> item
    const itemMaps = {};
    items.forEach((item) => {
        itemMaps[item.id] = item;
    });

    // 核心内容 id , 用于排除关联拓展的内容
    const coreContentIds = new Set();

    // 递归构建树
    function buildTree(parentId) {
        const tag = tagMaps[parentId];
        const childrenTags = tagChildrenMaps[parentId] || [];
        const childrenItems = getTagItems(tag, items);
        childrenItems.forEach((item) => {
            coreContentIds.add(item.id);
        });
        return {
            id: parentId,
            items: childrenItems,
            tags: childrenTags.map((t) => buildTree(t.id)).filter((t) => parentId === 'root' || t.items.length > 0 || t.tags.length > 0),
        }
    }

    const rootTree = buildTree("root");
    const tree = rootTree.tags[0];
    if (!tree) {
        return {};
    }
    // 拓展关联内容
    if (!tagMaps[tree.id].isTerms) {
        tree.expandItems = items.filter((item) => {
            return item.tags.findIndex((v) => tagMaps[v.id]) !== -1 && !coreContentIds.has(item.id);
        });   
    }

    // 构建脑图
    const buildMindTree = (tree, level) => {
        const tag = tagMaps[tree.id];
        const hasItems = tree.items.length > 0;
        const hasTags = tree.tags.length > 0 || tree.expandItems?.length > 0;
        return {
            data: {
                text: level === 1 && rootIsWrap  ?  tag.name.split('').join('\n') : tag.name,
                expand: hasTags || (tag.isTerms && tag?.map?.categories?.length) || expandAll,
                customExpand: !(hasTags || (tag.isTerms && tag?.map?.categories?.length)),
                color: '#ffffff',
                fillColor: colors[level -1] || '#6DBCBA'
            },
            children: [
                hasItems && hasTags && tree.items?.length && {
                    data: {
                        text: tag.isTerms ? "直属法条" : "直属法规",
                        expand: (tag.isTerms && tag?.map?.categories?.length) || expandAll,
                        customExpand:!(tag.isTerms && tag?.map?.categories?.length),
                        color: '#ffffff',
                        fillColor: colors[level] || '#6DBCBA'
                    },
                    children: buildContent(tag, tree.items, level + 1, expandAll),
                },
                ...hasItems && !hasTags ? buildContent(tag, tree.items, level, expandAll) : [],
                ...tree.tags.map((t) => buildMindTree(t, level + 1)).filter(v => v.children?.length),
                tree.expandItems?.length && {
                    data: {
                        text: "关联拓展",
                        expand: tag.isTerms || expandAll,
                        customExpand: !tag.isTerms,
                        color: '#ffffff',
                        fillColor: colors[level] || '#6DBCBA'
                    },
                    children: buildContent(tag, tree.expandItems, level + 1, expandAll),
                }
            ].filter(Boolean)
        }
    }

    return buildMindTree(tree, 1);
}


// 计算 tree 节点的数量
export function getTreeSize(tree) {
    if (!tree) {
        return 0;
    }
    let size = 1;
    if (tree.children) {
        size += tree.children.reduce((acc, child) => {
            return acc + getTreeSize(child);
        }, 0);
    }
    return size;
}

export function newGenerateMindTree(tree,  options) {
    if (!tree?.id && !tree?.name) {
        return {};
    }
    const { level = 1, rootIsWrap = false, expandAll = true, isTree = false } = options || {};
    const children = [];
    let hasExpand = false;
    if (tree?.children?.length) {
        children.push(...(tree.children || []).map((child) => {
            if (child.type === 'string') {
                hasExpand = true;
            }
            return newGenerateMindTree(child, { level: level + 1, rootIsWrap, expandAll, isTree });
        }));
    }
    const name =  level === 1 && rootIsWrap ?  tree.name.split('').join('\n') : tree.name;
    return {
        data: {
            id: tree.id,
            text: tree.ext_link && isTree ? `<p>${name} <a href="${tree.ext_link}" target="_blank" class="link">${tree.ext_name}</a> </p>` : name,
            richText: tree.ext_link && isTree,
            hyperlink: tree.link,
            ext_name: tree.ext_name,
            ext_link: tree.ext_link,
            expand: !hasExpand || expandAll,
            color: tree.type === 'string' ? undefined : '#ffffff',
            fillColor: tree.type === 'string' ? undefined : colors[level -1] || '#6DBCBA'
        },
        children: children.length > 0 ? children : undefined
    }
}