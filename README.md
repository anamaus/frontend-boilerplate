**Ana Maus Template for front end projects.**

**Includes:**

-Gulpfile: sass, browsersync, autoprefixer, eslint, scss-lint image optimizer, js and css minify, build...
Build: clean dist, js and css concatenation and  minification, image optimization.

-Sass architecture template: base(mixins, variables, placeholders, functions), vendor(reset), components, layout 

-Bootstrap 3 added through npm. Bootstrap variables in a separate file so you can easily overwrite bootstrap elements values, e.g. navigation collapse breakpoint.

-Custom made grid system in scss/layout/_grid. You can use this one if you don't want to use Bootstrap at all, for example.

Make sure you have Ruby installed so you can use scss linter.

Run _npm install gulp -g_ to install gulp globally.

Run _npm install_ to install all dependancies.

Run _gulp build_ to prepare project for live.
