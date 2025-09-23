// ChartUtils.js

export function calculateDateRange(year, month, quarterly) {
  console.log(year, month, quarterly)
  let dateStart, dateEnd, timeFrame;

  if (year && month) {
    timeFrame = year + "年" + parseInt(month) + "月";
    dateStart = new Date(year, month - 1, 1);
    dateEnd = new Date(year, month, 0);
  } else if (year && quarterly) {
    timeFrame = year + "年" + quarterly + "季度";
    let quartermonth = (quarterly - 1) * 3 + 1;
    dateStart = new Date(year, quartermonth - 1, 1);
    dateEnd = new Date(year, quartermonth + 2, 0);
  } else if (year) {
    timeFrame = year + "年";
    dateStart = new Date(year, 0, 1);
    dateEnd = new Date(year, 11, 31);
  } else {
    return {
      dateStart: '',
      dateEnd: '',
      timeFrame: ''
    }
  }

  let format = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  let dateResult = {
    dateStart: format(dateStart),
    dateEnd: format(dateEnd),
    timeFrame: timeFrame
  }

  // 返回计算结果
  return dateResult;
}


export function calculateQuarterlyFines(data) {
  const quarterlyFines = {};

  // 计算每个季度的罚款总额
  data.forEach(item => {
    const year = item.year_;
    const timeFrame = `${year}年${quarter}季度`;

    if (!quarterlyFines[timeFrame]) {
      quarterlyFines[timeFrame] = {
        sum_fine_individual: 0,
        sum_fine_unit: 0,
        sum_fine_all: 0
      };
    }

    quarterlyFines[timeFrame].sum_fine_individual += item.sum_fine_individual;
    quarterlyFines[timeFrame].sum_fine_unit += item.sum_fine_unit;
    quarterlyFines[timeFrame].sum_fine_all += item.sum_fine_all;
  });

  return quarterlyFines;
}