// URL 查询参数转 JSON 对象
export function parseQueryToJson(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    const keys = key.match(/([^\[\]]+)/g);
    let current = result;
    
    if (keys) {
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!(currentKey in current)) {
          current[currentKey] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        current = current[currentKey];
      }
      
      const lastKey = keys[keys.length - 1];
      if (Array.isArray(current)) {
        current.push(value);
      } else {
        try {
          current[lastKey] = JSON.parse(value);
        } catch {
          current[lastKey] = value;
        }
      }
    }
  }
  
  return result;
}

// JSON 对象转 URL 查询参数
export function parseJsonToQuery(json, prefix = '') {
  const parts = [];
  
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      const newPrefix = prefix ? `${prefix}[${key}]` : key;
      
      if (value === null || value === undefined) {
        continue;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            // 处理空数组
            parts.push(`${newPrefix}=`);
          } else {
            // 处理数组，包括嵌套数组和对象数组
            value.forEach((item, index) => {
              if (typeof item === 'object' && item !== null) {
                // 处理对象数组
                parts.push(parseJsonToQuery(item, `${newPrefix}[${index}]`));
              } else {
                // 处理基本类型数组
                parts.push(`${newPrefix}[]=${encodeURIComponent(item)}`);
              }
            });
          }
        } else {
          // 处理嵌套对象
          if (Object.keys(value).length === 0) {
            // 处理空对象
            parts.push(`${newPrefix}=`);
          } else {
            const nestedQuery = parseJsonToQuery(value, newPrefix);
            if (nestedQuery) {
              parts.push(nestedQuery);
            }
          }
        }
      } else {
        // 处理基本类型
        parts.push(`${newPrefix}=${encodeURIComponent(value)}`);
      }
    }
  }
  
  return parts.filter(Boolean).join('&');
}