var metalsmith = require('metalsmith'),
  branch = require('metalsmith-branch'),
  collections = require('metalsmith-collections'),
  excerpts = require('metalsmith-excerpts'),
  markdown = require('metalsmith-markdown'),
  permalinks = require('metalsmith-permalinks'),
  serve = require('metalsmith-serve'),
  templates = require('metalsmith-templates'),
  watch = require('metalsmith-watch'),
  moment = require('moment');


var siteBuild = metalsmith(__dirname)
  .metadata({
    site: {
      title: 'azurelogic.com',
      url: 'https://azurelogic.com'
    }
  })
  .source('./src')
  .destination('./build')
  .use(markdown())
  .use(excerpts())
  .use(collections({
    posts: {
      pattern: 'posts/**.html',
      sortBy: 'publishDate',
      reverse: true
    }
  }))
  .use(branch('posts/**.html')
      .use(permalinks({
        pattern: 'posts/:title',
        relative: false
      }))
  )
  .use(branch('!posts/**.html')
      .use(branch('!index.md').use(permalinks({
        relative: false
      })))
  )
  .use(templates({
        engine: 'jade',
        moment: moment
      }))
  .use(serve({
      port: 8080,
      verbose: true
    }))
    .use(watch({
      pattern: '**/*',
      livereload: true
    }))
  .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
  });
