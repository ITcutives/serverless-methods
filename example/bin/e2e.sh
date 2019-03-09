#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

source $SCRIPTPATH/environment.sh

node $SCRIPTPATH/../e2e/end-to-end.js
