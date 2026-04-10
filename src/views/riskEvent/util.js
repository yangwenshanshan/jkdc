// 获取某月最后一天
export function getMonthLastDay(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return new Date(year, month + 1, 0)
}

// 日期格式化 YYYY-MM-DD
export function formatDate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 处理 monthrange：结束时间自动设为月末
export function handleMonthRange([start, end]) {
  if (!start || !end) return []
  const lastDay = getMonthLastDay(end)
  return [formatDate(start), formatDate(lastDay)]
}