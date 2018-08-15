#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('child_process');
const yargs = require('yargs');
const pjson = require('../package.json');
const extract = require('../src/parser/extract.js');
const parseComments = require('../src/parser/parseComments.js');
const generateAPIFrame = require('../src/generateAPIFrame.js');
const refreshAPI = require('../src/refreshAPI.js');
const updateConfig = require('../src/updateConfig.js');
const {
  findRC,
} = require('../src/utils.js');

yargs.usage(`$0 ${
  pjson.version
}
Usage: $0 <command>
     $0 <target> [<target>]...

For more information, see https://www.npmjs.com/package/gutendocs.`);

yargs.option({
  all: {
    alias: 'a',
    default: false,
    describe: 'parse all js/jsx in dir and subdir',
  },
  init: {
    alias: 'i',
    default: false,
    describe: 'initialize gutendocs',
  },
  reset: {
    alias: 'r',
    default: false,
    describe: 'reset gutendocs to fresh state',
  },
  version: {
    alias: 'v',
    default: false,
    describe: 'output version of gutendocs installed',
  },
  config: {
    alias: 'c',
    default: false,
    describe: 'updates the API styles from gutenConfig.json',
  },
  info: {
    default: false,
    describe: 'get package info',
  },
}).help();

yargs.parse(process.argv.slice(2), (err, argv, output) => {
  const pathData = findRC();
  const address = pathData ? `${pathData[0].concat('/').concat(pathData[1])}/0.bundle.js` : undefined;

  // Output error if something unexpected happened
  if (err) {
    console.error(output); /* eslint-disable-line no-console */
    process.exitCode = 1;
    return;
  }

  // help or version info
  if (output) {
    console.log(output); /* eslint-disable-line no-console */
    return;
  }

  // initialize the gutendocs API
  if (argv.init) {
    const folderName = argv.init === true ? 'GutenApi/' : argv.init.concat('/');
    generateAPIFrame('./', folderName);
  }

  // output the npm info for the package
  if (argv.info) {
    exec('npm view gutendocs', ((npmErr, result) => {
      if (npmErr) {
        console.log('Failed to retrieve info'); /* eslint-disable-line no-console */
      } else {
        console.log(result); /* eslint-disable-line no-console */
      }
    }));
  }

  // update the config file
  if (argv.config) {
    if (pathData === false) {
      /* eslint-disable-next-line no-console */
      console.log('You have not initialized gutendocs.  Call "gutendocs --init"');
    } else {
      updateConfig(pathData[0].concat('/').concat(pathData[1]));
    }
  }

  // parse all files in directory and all subdirectories
  if (argv.all) {
    if (pathData === false) {
      /* eslint-disable-next-line no-console */
      console.log('You have not initialized gutendocs.  Call "gutendocs --init"');
    } else {
      // const exclude = fs.readFileSync(`${pathData[0]}/.gutenignore`, 'utf8').split('\n');
      extract(['./']).then((data) => {
        parseComments(data, address);
      });
    }
  }

  // reset the files to the way they were when initialize
  if (argv.reset) {
    if (pathData === false) {
      /* eslint-disable-next-line no-console */
      console.log('You have not initialized gutendocs.  Call "gutendocs --init"');
    } else {
      refreshAPI(pathData[0], pathData[1]);
    }
  }

  // if user supplied files parse them
  if (argv._.length > 0) {
    if (pathData === false) {
      /* eslint-disable-next-line no-console */
      console.log('You have not initialized gutendocs.  Call "gutendocs --init"');
    }

    // if the gutendocs has been intialized
    if (pathData !== false) {
      const missingFiles = [];
      argv._.forEach((fileName) => {
        if (!fs.existsSync(fileName)) {
          missingFiles.push(fileName);
        }
      });

      // Invalid file paths were supplied.
      if (missingFiles.length > 0) {
        console.log('These files do not exist:'); /* eslint-disable-line no-console */
        /* eslint-disable-next-line no-console */
        missingFiles.forEach(fileName => console.log(fileName));
        console.log('Parsing aborted.'); /* eslint-disable-line no-console */
      }

      // No invalid file paths supplied.  Parse the files.
      if (missingFiles.length === 0) {
        extract(argv._).then((data) => {
          parseComments(data, address);
        });
      }
    }
  }
});