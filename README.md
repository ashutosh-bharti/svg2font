# svg2font
Generate icon to font and style, &amp; convert font style.

## Install the fontello-cli

First, make sure you have the [fontello-cli](https://www.npmjs.com/package/fontello-cli) installed. For that run `npm install -g fontello-cli`.

## Initial setup

```
$ npm install
```

## Generate font

```
$ npm run generateIconFont
```

## Generate style

```
$ npm run generateIconStyle
```

##  Update icon

```
$ npm run updateIconConfig
```

Update icon in fontello and download config.json file. Then replace local config.json with new downloaded file.

##  Generate font and style in one command

```
$ npm start
```

This will create font files in `fonts/` directory and style files in `styles/` directory. It will convert final style file in `icon-dist/` directory.

For custom icon refer [fontello wiki](https://github.com/fontello/fontello/wiki/How-to-use-custom-images)
