# AdminBro Addon template

This an AdminBro addon template repository. You may use it if you want to create

* AdminBro plugin
* AdminBro adapter
* AdminBro feature

## What is inside

It is a typescript repository with:

* TypeScript
* linter with semantic commits (ensures the same style across AdminBro packages)
* semantic-release
* github actions
* example application with cypress

What is missing:
* cypress run in the CI which is an optional. You can take a look at admin-bro/core repository to see how to build it.

## How to use it

In order to start working on an AdminBro feature/plugin/adapter follow this steps:

1. fork this repository
2. Make sure it uses the latest versions of the packages
2. rename package in package.json
3. add env variables github settings:
- SLACK_WEBHOOK
- NPM_TOKEN
4. in the root folder:
- `yarn install`
-  `yarn link` (registers package in `linked packages` repository)
5. cd example-app
- `yarn install`
- `yarn add NAME_OF_YOUR_PACKAGE`
- `yarn link NAME_OF_YOUR_PACKAGE`
6. then in one terminal in the root folder run:
- `yarn build --watch`
7. in the second terminal in example app:
- `yarn dev`

You can read more about package linking in [yarn link documentation](https://classic.yarnpkg.com/en/docs/cli/link/)

## Publishing to NPM

package has semantic-release configured, but it don't upload build to NPM because of `private: true` set in package.json. In order to trigger automatic releases simply remove this line.

## License

AdminBro is Copyright © 2020 SoftwareBrothers.co. It is free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE.md) file.

## About SoftwareBrothers.co

<img src="https://softwarebrothers.co/assets/images/software-brothers-logo-full.svg" width=240>

We’re an open, friendly team that helps clients from all over the world to transform their businesses and create astonishing products.

* We are available for [hire](https://softwarebrothers.co/contact).
* If you want to work for us - checkout the [career page](https://softwarebrothers.co/career).