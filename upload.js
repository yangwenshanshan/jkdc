const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');

// 设置腾讯云 COS 配置
const cos = new COS({
    SecretId: 'your-secret-id', // 您的 SecretId
    SecretKey: 'your-secret-key', // 您的 SecretKey
    Region: 'ap-beijing', // 存储桶所在地域
});

// 部署目录
const deployDir = path.join(__dirname, 'dist');
// COS 存储桶名称
const bucket = 't-geek-insight-pages-1300849944';

// 检查 dist 目录是否存在
if (!fs.existsSync(deployDir)) {
    console.error('部署目录不存在');
    process.exit(1);
}

let list = []
// 递归遍历 dist 目录并上传文件
function deployFiles(dir) {
    const files = fs.readdirSync(dir);
    // 创建一个 Promise 数组，包含所有上传操作
    const uploadPromises = files.map(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // 如果是子目录，则递归处理
            return deployFiles(filePath);
        } else if (stats.isFile()) {
            // 如果是文件，则上传到 COS
            return new Promise((resolve, reject) => {
                cos.putObject({
                    Bucket: bucket,
                    Key: path.relative(deployDir, filePath),
                    Body: fs.createReadStream(filePath),
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
    });

    list = list.concat(uploadPromises);
}
// 开始部署
async function main() {
    await deployFiles(deployDir);
    // 等待所有上传操作完成
    Promise.all(list).then(() => {
        console.log('所有文件已上传');
    }).catch(err => {
        console.error('上传文件失败：', err);
    });
}

main()
