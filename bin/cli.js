#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require("path");
const rimraf = require("rimraf");
const chalk = require('chalk');
const symbols = require('log-symbols');

// [参考] https://segmentfault.com/a/1190000015222967?utm_source=sf-similar-article
program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if (!fs.existsSync(name)) {
            inquirer.prompt([{
                    name: 'description',
                    message: '请输入项目描述'
                },
                {
                    name: 'author',
                    message: '请输入作者名称'
                }
            ]).then((answers) => {
                const spinner = ora('正在下载模板...');
                spinner.start();

                const dir = path.join(process.cwd(), "test");

                rimraf.sync(dir, {});
                
                download('https://gitee.com:wquan/dva-quickStart#master', dir, { clone: true }, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    } else {
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if (fs.existsSync(fileName)) {
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        } else {
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    })

program.parse(process.argv);

// #!/usr/bin/env node

// [参考] https://segmentfault.com/a/1190000016208716?utm_source=sf-similar-article
// const program = require('commander');

// program
//   .version('0.1.0')
//   .option('-n, --yourname [yourname]', 'Your name')
//   .option('-g, --glad', 'Tell us you are happy')
//   .parse(process.argv);

// if (program.yourname) {
//   console.log(`Hello, ${program.yourname}! ${program.glad ? 'I am very happy to see you!' : ''}`);
// }