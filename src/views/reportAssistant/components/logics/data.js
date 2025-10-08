export function flattenTree(tree, level = 0, parentId = null, result = []) {
  if (Array.isArray(tree)) {
    tree.forEach((node, index) => {
      const newNode = { ...node, level, parentId, ...node.index };
      result.push(newNode);
      if (Array.isArray(node.indexes) && node.indexes.length > 0) {
        flattenTree(node.indexes, level + 1, node.id, result);
      }
    });
  } else {
    const newNode = { ...tree, level, parentId, ...tree.index };
    result.push(newNode);
    if (Array.isArray(tree.indexes) && tree.indexes.length > 0) {
      flattenTree(tree.indexes, level + 1, tree.id, result);
    }
  }
  return result;
}
export function flattenAndAddInfoTree (arr) {
  const list = flattenTree(arr)
  const result = []
  list.forEach(el => {
    const item = { ...el }
    if (item.level === 0) {
      item.isTitle = true
    }
    if (!item.indexes || item.indexes.length <= 0) {
      item.isCheckbox = true
    }
    delete item.indexes
    result.push(item)
  })
  return result
}

export function getBankTreeList() {
  return [
    {
      "name": "国有大型商业银行",
      "id": "1",
      "children": [
        {
          "name": "工商银行",
          "id": "53af5278-d29d-430b-bda6-a52fc20852b9",
          "back_id": "FII00004"
        },
        {
          "name": "农业银行",
          "id": "8220c590-a7a0-478b-8a1a-b94d5005cbaa",
          "back_id": "FII00005"
        },
        {
          "name": "中国银行",
          "id": "92a1ca45-32b4-4a1f-8ec4-e9ae837a6f22",
          "back_id": "FII00006"
        },
        {
          "name": "建设银行",
          "id": "ac4cc5eb-cc04-46e8-8f88-cc4b869b58a7",
          "back_id": "FII00007"
        },
        {
          "name": "交通银行",
          "id": "81f35463-b007-4f3f-88b1-8d6d03c14aba",
          "back_id": "FII00008"
        },
        {
          "name": "邮储银行",
          "id": "17c89f88-a8be-40e6-bb6e-299d705a9d84",
          "back_id": "FII00009"
        }
      ]
    },
    {
      "name": "股份制商业银行",
      "id": "2",
      "children": [
        {
          "name": "中信银行",
          "id": "3c6697fa-0a89-4cdf-ab6a-5e7fefc41321",
          "back_id": "FII00010"
        },
        {
          "name": "光大银行",
          "id": "32bb348a-eb98-4d6e-bcdc-c8b4e7beb442",
          "back_id": "FII00011"
        },
        {
          "name": "招商银行",
          "id": "d7eaf9d4-4210-4fac-a8c8-dbed0d147e49",
          "back_id": "FII00012"
        },
        {
          "name": "浦发银行",
          "id": "62775d59-68ba-4576-ba5f-0cdd3d6edcd6",
          "back_id": "FII00013"
        },
        {
          "name": "民生银行",
          "id": "a0040518-2fb8-416f-b66b-86e2cca503b7",
          "back_id": "FII00014"
        },
        {
          "name": "华夏银行",
          "id": "f1bd57f7-a822-4d56-8af2-70cd20edfbb2",
          "back_id": "FII00015"
        },
        {
          "name": "平安银行",
          "id": "31eb7c9e-5543-4231-b7eb-02a85c159c3b",
          "back_id": "FII00016"
        },
        {
          "name": "兴业银行",
          "id": "4e41631c-4c84-429e-aa9f-a5805e04b0b3",
          "back_id": "FII00017"
        },
        {
          "name": "浙商银行",
          "id": "f058c904-2f53-48d3-b6bb-ba13eb47f9bb",
          "back_id": "FII00020"
        },
        {
          "name": "广发银行",
          "id": "1e0ab267-9ed2-4763-972b-2cb24a9ba4d4",
          "back_id": "FII00018"
        },
        {
          "name": "恒丰银行",
          "id": "48550fec-6a99-4311-b8ca-d3906406207c",
          "back_id": "FII00021"
        }
      ]
    },
    {
      "name": "城市商业银行",
      "id": "3",
      "children": [
        {
          "name": "北京银行",
          "id": "59de14fd-3ad1-4198-b2a6-b0fa931dd93b",
          "back_id": "FII00022"
        },
        {
          "name": "上海银行",
          "id": "2735552f-9ca7-49e6-9e56-e280af24b9f7",
          "back_id": "FII00063"
        },
        {
          "name": "江苏银行",
          "id": "8828dfbb-3b60-4042-937e-2bba32856233",
          "back_id": "FII00064"
        },
        {
          "name": "南京银行",
          "id": "6bf49b4d-ae09-491c-9f68-6f3be32e3114",
          "back_id": "FII00065"
        },
        {
          "name": "苏州银行",
          "id": "f73bf771-d968-482b-b06f-074302dc7c7b",
          "back_id": "FII00066"
        },
        {
          "name": "杭州银行",
          "id": "548cdbda-5187-4639-ac5b-752d012a6a12",
          "back_id": "FII00068"
        },
        {
          "name": "齐鲁银行",
          "id": "e40b6117-9b19-405b-9cd8-8726c3d893e5",
          "back_id": "FII00085"
        },
        {
          "name": "郑州银行",
          "id": "cd39ec21-8760-401a-b2ca-b82fb5b2bea6",
          "back_id": "FII00099"
        },
        {
          "name": "长沙银行",
          "id": "e7611b3f-352f-47c0-9c3f-d8d406bc33bc",
          "back_id": "FII00104"
        },
        {
          "name": "重庆银行",
          "id": "590c3a98-0be0-4261-95ea-29bf1d95d532",
          "back_id": "FII00117"
        },
        {
          "name": "成都银行",
          "id": "01735882-7053-41c0-b194-68a5dd4b4c94",
          "back_id": "FII00118"
        },
        {
          "name": "贵阳银行",
          "id": "129cfcbf-f836-46bc-a4ae-fe26352aaf22",
          "back_id": "FII00131"
        },
        {
          "name": "西安银行",
          "id": "19553561-d43e-4e3d-aadb-264fb1651c4c",
          "back_id": "FII00137"
        },
        {
          "name": "兰州银行",
          "id": "4c1d214c-2e0a-44f8-b6b1-7caa3a154673",
          "back_id": "FII00140"
        },
        {
          "name": "宁波银行",
          "id": "6a295eb5-9b2d-43b2-a2aa-f92347ca6062",
          "back_id": "FII00150"
        },
        {
          "name": "厦门银行",
          "id": "c512486b-a5ce-4540-bd3e-9a238e8fd63c",
          "back_id": "FII00153"
        },
        {
          "name": "青岛银行",
          "id": "152c1819-09c4-45f9-8b6b-ef33ce216229",
          "back_id": "FII00155"
        }
      ]
    },
    {
      "name": "农村商业银行",
      "id": "4",
      "children": [
        {
          "name": "上海农村商业银行",
          "id": "33509ddc-c89e-4e8a-bb46-0fe36e0e21a4",
          "back_id": "FII01186"
        },
        {
          "name": "江苏江阴农村商业银行",
          "id": "15a82f66-6630-4eeb-9732-8993fae833aa",
          "back_id": "FII01204"
        },
        {
          "name": "江苏张家港农村商业银行",
          "id": "42c89bb5-0c97-4d76-a83b-d71d68553408",
          "back_id": "FII01205"
        },
        {
          "name": "江苏常熟农村商业银行",
          "id": "70ec8eab-e73b-4a99-97dc-0f53b19a659b",
          "back_id": "FII01209"
        },
        {
          "name": "江苏苏州农村商业银行",
          "id": "70de2d3b-3869-4c33-a6db-9df0e0b976d8",
          "back_id": "FII01243"
        },
        {
          "name": "无锡农村商业银行",
          "id": "bd215b37-6578-4ff6-b0d4-3e9f6c2580a5",
          "back_id": "FII01246"
        },
        {
          "name": "江苏紫金农村商业银行",
          "id": "157ef1c3-ad72-43b0-a7e2-87b355f09f6b",
          "back_id": "FII01253"
        },
        {
          "name": "浙江绍兴瑞丰农村商业银行",
          "id": "4fcf0ab5-25f3-4661-a6b7-fb22c50e830c",
          "back_id": "FII01369"
        },
        {
          "name": "重庆农村商业银行",
          "id": "a34d7108-f1f2-4e86-822d-d8fce27333a0",
          "back_id": "FII03048"
        },
        {
          "name": "青岛农村商业银行",
          "id": "a3a574ab-ff2d-4739-91bc-2a36f5b86a6e",
          "back_id": "FII04063"
        }
      ]
    },
    {
      "name": "政策性银行",
      "id": "5",
      "children": [
        {
          "name": "国家开发银行",
          "id": "588ab682-f7e0-4172-9e0f-130ce9d04252",
          "back_id": "FII00001"
        },
        {
          "name": "进出口银行",
          "id": "bab08933-8666-4f64-9d5c-8043813d81bb",
          "back_id": "FII00002"
        },
        {
          "name": "农业发展银行",
          "id": "b684f15f-8a82-46f9-9024-5a53466eb055",
          "back_id": "FII00003"
        }
      ]
    }
  ]
}