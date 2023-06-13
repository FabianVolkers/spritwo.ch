# spritwo.ch

The home page for spritwoch events.

## Local Development

Install ruby and jekyll.

```zsh
bundle exec jekyll serve -l # for live reloading
```


### Test GitHub Actions

```zsh
set -a
source .github/workflow-helpers/.env                    
set +a 
```

## Automations

- google calendar sync
- update countdown
- generate preview image
- (generate event pages)

## Special thanks to

- Kristof Friess for the [original splitflap code](https://codepen.io/zebresel/pen/VwbOgQR)
- Cassidy for the [original pool background and sign](https://codepen.io/cassidoo/pen/mdmjmob)