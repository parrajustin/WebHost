#!/bin/bash
# My first script

if [ "$#" -gt 1 ]; then
    echo "Too many arguments";
    exit;
fi

if [ "$1" = "pull" ]; then
    git pull origin master;
    echo "pulled origin";
    exit;
elif [ "$1" = "run" ]; then
	npm run;
else
    echo "========] Git Sh File [========";
    echo "Commands: ";
    echo " - pull";
    echo " - run";
fi



