# pathfix.js -- Managing shell's PATH variable

Not such a big, but that is something I needed back in the day when managing various different software packages and switching from one setup to the other tended to allways adding another directory to the shell PATH variable. So one day, I sat down and wrote a little ruby script to remove duplicates from the shell PATH var, append or prepend new directories easily, or, remove dir entries based on regualar expression matching.

```sh
# echo dublicate cleaned PATH variable
$ pathfix

# prepend (from the front) dir to PATH
$ pathfix + /some/local/path

# append dir to PATH
$ pathfix $ /some/local/path

# remove all dirs from path which contain 'ruby'
$ pathfix - ruby
```

But! Tricky! A program CAN'T manuipulate the env var settings of its parent process. Means, the `pathfix` script, cannot CHANGE the PATH var in the surrounding shell. But this is what you usually want. In order to put this script to use, you need to add a little shell function to your env, like this: 

```sh
function path {
    new_path="$(pathfix $*)"
    if [ "$?" -eq 0 ]; then 
        PATH=${new_path}
        export PATH
    fi
}
```

This makes a `path` command available in your shell, and puts whatever the result is from the pathfix script into the PATH variable. Like this:

```sh
$ echo $PATH
/Users/crux/.nvm/versions/node/v16.13.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/crux/.cargo/bin:/usr/local/opt/fzf/bin
$ path + ~/bin   
$ echo $PATH  
/Users/crux/bin:/Users/crux/.nvm/versions/node/v16.13.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/crux/.cargo/bin:/usr/local/opt/fzf/bin
$ 
```
