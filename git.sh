#!/bin/bash
# My first script

if [$# > 1]; then
	echo "Too many arguments";
	exit;
fi

if [$1 == "pull"]; then
	git pull origin master;
	echo "pulled origin";
	exit;
else
	echo "Git Sh File";
	echo "Commands: ";
	echo " pull";
fi