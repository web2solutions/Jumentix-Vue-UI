let SSH = require('simple-ssh'),
  pkg = require('../package.json'),
  env = 'test-mac', // test or production
  config = require('../config/deploy.json')[env],
  mconfig = require('../config/config.json')[env],
  color = require('colors-cli'),
  ssh = new SSH({
    host: config.host,
    user: config.user,
    pass: config.pass
  }),
git = require('simple-git')(),
  commit_message = config.default.commit_message;

process.argv.forEach((arg) => {
  if (arg.indexOf('--m=') > -1) {
    commit_message = arg.split('m=')[1]
  }
})

console.log('Updating ' + color.red_bt(pkg.main.replace(/\.js/g, "").toUpperCase()) + ' Github repository')

git
  .add('./*')
  .commit(commit_message)
  .push('origin', 'master', () => {

    //console.log('done')

    console.log('Repo ' + color.red_bt(pkg.main.replace(/\.js/g, "").toUpperCase()) + ' is ready. ')
    console.log(color.blue_bt('Connecting to ' + config.host + ':22'))


    let literal = `
            cd ${config.server_dir} && 
            npm install --force &&
            npm run build && 
            export NODE_ENV=${env} && 
            pm2 restart ${pkg.main}
        `;

    ssh
      .on('error', function (err) {
        console.log('Deploy in ' + color.red(env.toUpperCase()) + ' has failed.')
        console.log(color.red(err));
        ssh.end();
      })
      .on('ready', function (err) {
        console.log('SSH is ready. Deploying ' + color.red_bt(pkg.main.replace(/\.js/g, "").toUpperCase()) + ' in ' + color.red_bt(env.toUpperCase()) +
          ' - ' + color.blue_bt(config.host) +
          '. Application port: ' + color.red_bt(mconfig.port))
        console.log('\n')
      })
      .exec('cd ' + config.server_dir + ' && git pull', {
        out: function (stdout) {
          console.log(color.green_b(stdout))
        },
        err: function (stderr) {
          console.log(color.red(stderr))
        }
      })
      .exec(literal, {
        out: function (stdout) {
          console.log(color.green_b(stdout));
          //console.log('xx==========')
          //console.log('Deploy in ' + env.toUpperCase() + ' is 100% done.')
        },
        err: function (stderr) {
          console.log(color.red(stderr))
        }
      })
      .start()
  });

// $ npm run deploy-test -- --m="test deploy with build"
