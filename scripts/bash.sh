#!/bin/bash

cd tmp
echo "__NPM_BASH_START__"
CMD=$(echo $1 | base64 --decode)
eval "$CMD"
echo "__NPM_BASH_EXIT_CODE__$?"
