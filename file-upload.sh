#!/bin/bash
safe_source () { [[ ! -z ${1:-} ]] && source $1; _dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; _sdir=$(dirname "$(readlink -f "$0")"); }; safe_source
mkdir -p /tmp/uploads
port=8080
ifconfig | grep "inet\b" | awk '{print $2 ":"'"$port"'}'
node $_sdir/index.js
