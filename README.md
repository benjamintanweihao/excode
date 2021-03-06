# ExCode: A Real-time™ Typing Game for Bored Programmers

![ExCodeLogo](https://raw.githubusercontent.com/benjamintanweihao/excode/master/priv/static/images/logo.png)

## Starting the Application

To start your new Phoenix application:

1. Install dependencies with `mix deps.get`
2. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit `localhost:4000` from your browser.

## Roadmap

Here is how it looks like so far:

![](http://i.imgur.com/PujG2il.png)

### First Iteration

- [x] Single player 
- [x] Basic statistics
- [x] Countdown timer
- [x] Fixed exercise

### Second Iteration

- [x] Multi-player (multiple cursors)
- [x] Show all players current position
- [x] Full game logic
- [x] Styling

### Third Iteration

- [x] Deploying to Heroku
- [x] Selecting exercise based on programming language
- [x] Filtering out non-typeables
- [ ] OAuth (maybe)

## Credits

Special thanks to [Zaven Muradyan](https://github.com/voithos/swiftcode) for the original code.

## Heroku Notes

For Heroku deployments, you need to manually include the assets that were automatically generated by Phoenix.

```
% find priv -type file | grep -v .DS_Store | xargs git add -f
```

