import step21 from '../../assets/images/penaltyReport/step2-1.png'
import step22 from '../../assets/images/penaltyReport/step2-2.png'
import step23 from '../../assets/images/penaltyReport/step2-3.png'
import step24 from '../../assets/images/penaltyReport/step2-4.png'

export function getTimePeriod () {
  const result = [
    {
      value: 1,
      name: '月度报告',
      list: []
    },
    {
      value: 2,
      name: '季度报告',
      list: []
    },
    {
      value: 3,
      name: '半年度报告',
      list: []
    },
    {
      value: 4,
      name: '年度报告',
      list: []
    }
  ]
  const pastMonths = getPastTwelveMonths()
  const pastQuarters = getRecentFourQuarters()
  const pastHalfYear = getRecentTwoHalfYears()
  pastMonths.forEach(element => {
    result[0].list.push(element)
  });
  pastQuarters.forEach(element => {
    result[1].list.push(element)
  });
  pastHalfYear.forEach(element => {
    result[2].list.push(element)
  });
  const currentYear = new Date().getFullYear() - 1
  result[3].list.push({
    name: `${currentYear}年度`,
    value: `${currentYear}年度`
  })
  return result
}

export function getBanklogics () {
  return [
    {
      name: '银行业分析',
      img: step21,
      checked: false,
      children: [
        {
          name: '概览',
          children: [
            {
              name: '罚单数与金额概览',
            },
            {
              name: '罚单数与金额趋势',
            }
          ]
        },
        {
          name: '受罚对象',
          children: [
            {
              name: '受罚对象概览',
            },
            {
              name: '受罚对象趋势',
            }
          ]
        },
        {
          name: '总部与属地监管',
          children: [
            {
              name: '总部处罚情况',
            },
            {
              name: '地区分布',
            }
          ]
        },
        {
          name: '机构分布',
        },
        {
          name: '职能领域分布',
        },
        {
          name: '典型领域及问题分析',
          children: [
            {
              name: '领域相关处罚概览',
            },
            {
              name: '领域罚单地区分布',
            },
            {
              name: '领域罚单机构分布',
            },
            {
              name: '子领域分布',
            },
            {
              name: '领域趋势',
            },
            {
              name: '典型问题类型',
            },
            {
              name: '典型问题趋势',
            }
          ]
        },
        {
          name: '重点银行（Top20）',
        },
        {
          name: '典型大额罚单',
        },
      ]
    },
    {
      name: '银行群体分析',
      img: step22,
      checked: false
    },
    {
      name: '单价银行分析',
      img: step23,
      checked: false
    },
    {
      name: '多家对比分析',
      img: step24,
      checked: false
    }
  ]
}

function getPastTwelveMonths() {
  const now = new Date();
  const pastMonths = [];

  for (let i = 0; i < 12; i++) {
    const pastMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = pastMonth.getFullYear();
    const month = (pastMonth.getMonth() + 1).toString().padStart(2, '0');
    pastMonths.unshift({
      name: `${year}年${month}月`,
      value: `${year}-${month}`
    });
  }

  return pastMonths;
}

function getRecentFourQuarters() {
  const quarters = [];
  const now = new Date();

  const currentQuarterYear = now.getFullYear();
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

  for (let i = 1; i <= 4; i++) {
    let year = currentQuarterYear;
    let quarter = currentQuarter - i;

    if (quarter <= 0) {
      quarter += 4;
      year -= 1;
    }

    quarters.push({
      name: `${year}年${quarter}季度`,
      value: `${year}年${quarter}季度`
    });
  }

  return quarters.reverse();
}

function getRecentTwoHalfYears() {
  const halfYears = [];
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentHalfYear = currentMonth < 6 ? '上半年' : '下半年';

  let year = currentYear - (currentHalfYear === '下半年' ? 0 : 1);
  let halfYear = currentHalfYear === '上半年' ? '下半年' : '上半年';

  for (let i = 0; i < 2; i++) {
    halfYears.push({
      value: `${year}年${halfYear}`,
      name: `${year}年${halfYear}`
    });

    if (halfYear === '上半年') {
      year -= 1;
      halfYear = '下半年';
    } else {
      halfYear = '上半年';
    }
  }

  return halfYears.reverse();
}