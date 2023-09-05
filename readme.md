box.com upload preparation script

box has strict limitations and file and folder names

for example you can't have leading or tailing whitespaces

and a few other things

but they don't offer tooling to auto-fix those

so its impossible for enterprise companies to migrate their existing stoarge pools to box

this script fixes some of the issues by scanning a folder and renaming incompatible names to compatible names by
trimming leading and tailing whitespace and esnuring unique names by appending a uuid, modification dates are keept and
not manipulated due to the compatiblity fix