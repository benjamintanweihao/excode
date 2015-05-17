# Searching for random code snippets in GitHub

## Retrieve a list of the most popular repositories filtered by language name

```
https://api.github.com/search/repositories?q=+language:elixir&sort=stars&order=desc
```

## Retreive a list of files filtered by language, repository, and size. Test directories are ignored.

```
https://api.github.com/search/code?q=+in:file+language:elixir+repo:elixir-lang/elixir+NOT+test+NOT+unit+NOT+spec+in:path+size:500..1000
```
