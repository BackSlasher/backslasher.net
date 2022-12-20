#!/bin/bash
set -e
DOCX_FILE=$(mktemp)
OUT_DIR=$(mktemp -d)
rclone cat 'drive:new job/Resume.docx' >$DOCX_FILE
lowriter --convert-to pdf $DOCX_FILE --outdir $OUT_DIR
mv $OUT_DIR/*.pdf "$1"
