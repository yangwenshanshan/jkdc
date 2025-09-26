export function flattenTree(tree, level = 0, parentId = null, result = []) {
  if (Array.isArray(tree)) {
    tree.forEach((node, index) => {
      const newNode = { ...node, level, parentId };
      result.push(newNode);
      if (Array.isArray(node.children) && node.children.length > 0) {
        flattenTree(node.children, level + 1, node.id, result);
      }
    });
  } else {
    const newNode = { ...tree, level, parentId };
    result.push(newNode);
    if (Array.isArray(tree.children) && tree.children.length > 0) {
      flattenTree(tree.children, level + 1, tree.id, result);
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
    if (!item.children || item.children.length <= 0) {
      item.isCheckbox = true
    }
    delete item.children
    result.push(item)
  })
  return result
}


export function getIndustry () {
  return [
    {
      id: '123',
      name: '概览',
      children: [
        {
          id: '124',
          name: '罚单数与金额概览',
        },
        {
          id: '125',
          name: '罚单数与金额趋势',
        },
      ]
    },
    {
      id: '126',
      name: '受罚对象',
      children: [
        {
          id: '127',
          name: '受罚对象概览',
        },
        {
          id: '128',
          name: '受罚对象趋势',
        },
      ]
    },
    {
      id: '129',
      name: '总部与属地监管',
      children: [
        {
          id: '130',
          name: '总部处罚情况',
        },
        {
          id: '131',
          name: '地区分布',
        },
      ]
    },
    {
      id: '132',
      name: '机构分布',
    },
    {
      id: '133',
      name: '职能领域分布',
    },
    {
      id: '134',
      name: '典型领域及问题分析',
      children: [
        {
          id: '135',
          name: '领域相关处罚概览',
        },
        {
          id: '136',
          name: '领域罚单地区分布',
        },
        {
          id: '137',
          name: '领域罚单机构分布',
        },
        {
          id: '138',
          name: '子领域分布',
        },
        {
          id: '139',
          name: '领域趋势',
        },
        {
          id: '140',
          name: '典型问题类型',
        },
        {
          id: '141',
          name: '典型问题趋势',
        },
      ]
    },
    {
      id: '142',
      name: '重点银行（Top20）',
    },
    {
      id: '143',
      name: '典型大额罚单',
    },
  ]
}
export function getGroup () {
  return [
    {
      id: '144',
      name: '概览',
      children: [
        {
          id: '145',
          name: '罚单数与金额概览',
        },
        {
          id: '146',
          name: '罚单数与金额趋势',
        },
      ]
    },
    {
      id: '147',
      name: '受罚对象',
      children: [
        {
          id: '148',
          name: '受罚对象概览',
        },
        {
          id: '149',
          name: '受罚对象趋势',
        },
      ]
    },
    {
      id: '150',
      name: '总部与属地监管',
      children: [
        {
          id: '151',
          name: '总部处罚情况',
        },
        {
          id: '152',
          name: '地区分布',
        },
      ]
    },
    {
      id: '154',
      name: '职能领域分布',
    },
    {
      id: '155',
      name: '典型领域及问题分析',
      children: [
        {
          id: '156',
          name: '领域相关处罚概览',
        },
        {
          id: '158',
          name: '领域罚单机构分布',
        },
        {
          id: '159',
          name: '子领域分布',
        },
        {
          id: '160',
          name: '领域趋势',
        },
        {
          id: '161',
          name: '典型问题趋势',
        },
      ]
    },
    {
      id: '162',
      name: '重点银行（Top20）',
    },
    {
      id: '163',
      name: '典型大额罚单',
    },
  ]
}
export function getSingle () {
  return [
    {
      id: '164',
      name: '概览',
      children: [
        {
          id: '165',
          name: '罚单数与金额概览',
        },
        {
          id: '166',
          name: '罚单数与金额趋势',
        },
      ]
    },
    {
      id: '167',
      name: '受罚对象',
      children: [
        {
          id: '168',
          name: '受罚对象概览',
        },
        {
          id: '169',
          name: '受罚对象趋势',
        },
      ]
    },
    {
      id: '170',
      name: '总部与属地监管',
      children: [
        {
          id: '171',
          name: '总部处罚情况',
        },
        {
          id: '172',
          name: '地区分布',
        },
      ]
    },
    {
      id: '174',
      name: '职能领域分布',
    },
    {
      id: '175',
      name: '典型领域及问题分析',
      children: [
        {
          id: '176',
          name: '领域相关处罚概览',
        },
        {
          id: '178',
          name: '领域罚单机构分布',
        },
        {
          id: '179',
          name: '子领域分布',
        },
        {
          id: '180',
          name: '领域趋势',
        },
        {
          id: '181',
          name: '典型问题趋势',
        },
      ]
    },
    {
      id: '182',
      name: '重点银行（Top20）',
    },
    {
      id: '183',
      name: '典型大额罚单',
    },
  ]
}
export function getMultiple () {
  return [
    {
      id: '184',
      name: '总体对比',
      children: [
        {
          id: '185',
          name: '各行罚单数与金额排名',
        },
        {
          id: '186',
          name: '各行罚单数与金额排名趋势变化',
        },
      ]
    },
    {
      id: '187',
      name: '地区对比',
      children: [
        {
          id: '188',
          name: '各行受罚较重地区Top5',
        },
        {
          id: '189',
          name: '地区处罚中各行排名',
        },
      ]
    },
    {
      id: '190',
      name: '领域对比',
      children: [
        {
          id: '191',
          name: '各行受罚较重领域Top5',
        },
        {
          id: '192',
          name: '典型领域中各行排名',
        },
        {
          id: '193',
          name: '各行受罚较重问题类型Top10',
        },
      ]
    },
  ]
}
export function getBankList () {
  const chineseBankNames = [
    "工商银行",
    "农业银行",
    "建设银行",
    "中国银行",
    "交通银行",
    "中信银行",
    "光大银行",
    "华夏银行",
    "民生银行",
    "广发银行",
    "平安银行",
    "招商银行",
    "兴业银行",
    "浦发银行",
    "邮储银行"
  ];
  const bankObjects = [];
  for (let i = 1; i <= 50; i++) {
    const randomIndex = Math.floor(Math.random() * chineseBankNames.length);
    const bankObject = {
      id: i,
      name: `${chineseBankNames[randomIndex]}${randomIndex}${chineseBankNames[randomIndex]}${chineseBankNames[randomIndex]}${chineseBankNames[randomIndex]}${chineseBankNames[randomIndex]}${chineseBankNames[randomIndex]}` 
    };
    bankObjects.push(bankObject);
  }
  return bankObjects;
}
export function getBankTreeList() {
  const chineseGroupNames = [
    "华夏银行",
    "光大银行",
    "招商银行",
    "民生银行",
    "广发银行",
    "交通银行",
    "建设银行",
    "中国银行",
    "工商银行",
    "农业银行"
  ];
  const chineseBankObjects = [];
  for (let i = 0; i < 10; i++) {
    const chineseName = chineseGroupNames[i % chineseGroupNames.length];
    const group = { id: i + 1, name: `${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}`, children: [] };
    for (let j = 1; j <= 10; j++) {
      const bankObject = { id: i * 10 + j, name: `${chineseName} - 子银行 ${j}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}${chineseName}` };
      group.children.push(bankObject);
    }

    chineseBankObjects.push(group);
  }
  return chineseBankObjects;
}