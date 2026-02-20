# [0.6.0](https://github.com/mbabic84/drw/compare/v0.5.3...v0.6.0) (2026-02-20)


### Features

* use source-based CLI with runtime detection wrapper ([7971270](https://github.com/mbabic84/drw/commit/7971270ef4d7a1f60de5114b316c7b37ad0bbacf))

## [0.5.3](https://github.com/mbabic84/drw/compare/v0.5.2...v0.5.3) (2026-02-20)


### Bug Fixes

* replace Bun-specific APIs with Node.js standard APIs ([6bf9f85](https://github.com/mbabic84/drw/commit/6bf9f85e0a109ba94687349be3ede78d1068e9aa))

## [0.5.2](https://github.com/mbabic84/drw/compare/v0.5.1...v0.5.2) (2026-02-19)


### Bug Fixes

* improve bash tab completion behavior ([402b52e](https://github.com/mbabic84/drw/commit/402b52ed8787ba58bb549f2cf1be240a3c7fc0f6))

## [0.5.1](https://github.com/mbabic84/drw/compare/v0.5.0...v0.5.1) (2026-02-19)


### Bug Fixes

* replace commander with custom CLI parser ([ea0f67e](https://github.com/mbabic84/drw/commit/ea0f67ef1cb98fc296d15cd476a1c225111a8708))

# [0.5.0](https://github.com/mbabic84/drw/compare/v0.4.1...v0.5.0) (2026-02-19)


### Bug Fixes

* add semantic-release plugins as dev dependencies ([3f58be1](https://github.com/mbabic84/drw/commit/3f58be1d0cdd4769c85700727ca958b6c6b3bd59))
* change trigger to push for semantic-release ([60b69a4](https://github.com/mbabic84/drw/commit/60b69a420e864641e28926d34f00250723b0ab0d))
* correct ssh-agent action name ([44f016b](https://github.com/mbabic84/drw/commit/44f016b6c7f27b44bb141868b9467004b8e6b748))
* disable github plugin comments and labels ([bfc8e0c](https://github.com/mbabic84/drw/commit/bfc8e0c9e0f609f23e5f3435df704427667193ab))
* dynamically fetch last release SHA for release-please ([82e682a](https://github.com/mbabic84/drw/commit/82e682ace52ea1dcdea1f0fb7ea7a4fc12372f35))
* improve workflow reliability for semantic-release ([c5db4b9](https://github.com/mbabic84/drw/commit/c5db4b9d6f7de6bfe6ac23054d98e544bf6ce7ba))
* read version from package.json instead of hardcoded value ([205b6b9](https://github.com/mbabic84/drw/commit/205b6b9c576a9882862c43e98ed061c0d0b36d48))
* remove package-name from config and use registries input ([d6f717d](https://github.com/mbabic84/drw/commit/d6f717d3fce4944e663168a99521f2d9deb3ed9e))
* use correct tag_name output from release-please and update action versions ([aa7e580](https://github.com/mbabic84/drw/commit/aa7e58079b6f20179ee696e5cccde89da512bd2b))
* use correct tag_name output from release-please and update action versions ([0c5d248](https://github.com/mbabic84/drw/commit/0c5d248bf11b223af9068cd22719a1580857d01b))
* use manifest config for release-please to track versions ([831ef4c](https://github.com/mbabic84/drw/commit/831ef4c15416e0af99a277659ab0003252d33bb3))
* use npm trusted publishing (OIDC) instead of NPM_TOKEN ([de69c1f](https://github.com/mbabic84/drw/commit/de69c1f5802c0b0a85d99bcd3a6eedef7bde2b0f))
* use SSH deploy key for git push to bypass branch protection ([470537a](https://github.com/mbabic84/drw/commit/470537af6711610ec0e34f8acc0e6167a6325077))
* use SSH URL for repository to work with deploy key ([c11f670](https://github.com/mbabic84/drw/commit/c11f6701a79319c4a006000d462b802187528b61))


### Features

* replace release-please with semantic-release ([2289393](https://github.com/mbabic84/drw/commit/2289393bdd574df7e4c6feb4407c76fa883a10e6))

# Changelog

## [0.4.1](https://github.com/mbabic84/drw/compare/v0.4.0...v0.4.1) (2026-02-19)


### Bug Fixes

* skip pull request in release-please and fix tag output ([e163c30](https://github.com/mbabic84/drw/commit/e163c30dfec8f6e853ca5f4277a82189325f2bf7))
* skip pull request in release-please and fix tag output ([78da39c](https://github.com/mbabic84/drw/commit/78da39ca637c192894ae0ee998e4b424c57ddb47))

## [0.4.0](https://github.com/mbabic84/drw/compare/v0.3.0...v0.4.0) (2026-02-19)


### Features

* integrate npm publish and binary upload into release-please workflow ([ae24daa](https://github.com/mbabic84/drw/commit/ae24daae7370133425a2db9539d6cac08f230c75))
* integrate npm publish and binary upload into release-please workflow ([dddbc95](https://github.com/mbabic84/drw/commit/dddbc9533b77d430d1975f662f219f2001f7ef11))

## [0.3.0](https://github.com/mbabic84/drw/compare/v0.2.0...v0.3.0) (2026-02-19)


### Features

* move npm publish to release workflow ([272b591](https://github.com/mbabic84/drw/commit/272b591d0c16ce5e88e0589d301336ca62f597bb))
* move npm publish to release workflow for reliable publishing ([eb6499b](https://github.com/mbabic84/drw/commit/eb6499b38166099bf24285f7505a1867bb6c7dc6))

## [0.2.0](https://github.com/mbabic84/drw/compare/v0.1.0...v0.2.0) (2026-02-19)


### Features

* add release workflow and update GitHub Actions (#minor) ([c48add8](https://github.com/mbabic84/drw/commit/c48add8a135c178a5e12afa56d7d83f54037ee26))
* add release workflow and update GitHub Actions (#minor) ([f9a0205](https://github.com/mbabic84/drw/commit/f9a02056de4722c4c7afcc82cd47eab4a59892e6))
* adopt release-please-action for automated version management ([182e57b](https://github.com/mbabic84/drw/commit/182e57bf24d34422e498c8c03de072b039865ee4))
* enforce conventional commits and PR workflow ([262c1b3](https://github.com/mbabic84/drw/commit/262c1b3a3c43262df9d01e21812f8b651c711efd))


### Bug Fixes

* apply GitHub Actions best practices ([4bfbbfa](https://github.com/mbabic84/drw/commit/4bfbbfa2de5e5a54292f7ee10b9fd76b1085c158))
* apply GitHub Actions best practices (#patch) ([b4f4a74](https://github.com/mbabic84/drw/commit/b4f4a7400d1df4ec7f14ef45eb3a7b80798bbb63))
* correct workflow syntax errors ([1867263](https://github.com/mbabic84/drw/commit/1867263d2f5d94383e390a8224ecf25b50eb5b3e))
* correct workflow syntax errors ([6e90eeb](https://github.com/mbabic84/drw/commit/6e90eebb4f8210175218b3345447d55d04e2e1a4))
* remove package-lock.json from version bump workflow (#patch) ([dceec3e](https://github.com/mbabic84/drw/commit/dceec3e939f09e26f02fe25dbef492e0c1971519))
* remove package-lock.json from version bump workflow (#patch) ([1bdcaf6](https://github.com/mbabic84/drw/commit/1bdcaf6e0a56606134a3b0a22dccb05b063e9bf1))
* resolve flaky test and add AGENTS.md ([67a76ed](https://github.com/mbabic84/drw/commit/67a76ed39b37484ec9ec31c9dd110773b5f2d700))
