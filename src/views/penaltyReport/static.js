




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