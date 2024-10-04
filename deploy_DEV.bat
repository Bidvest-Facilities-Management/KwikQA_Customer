
@echo off
echo Compiling...
cmd /c "ng build"
echo Clearing target directory
rmdir /s/q \\ho24000\d$\inetpub\www\wapps.bidvestfm.co.za\VENDORS\BFMFIN_DEV
mkdir \\ho24000\d$\inetpub\www\wapps.bidvestfm.co.za\VENDORS\BFMFIN_DEV
echo Copying compiled code to target directory
xcopy .\dist\baseapp\browser\* \\ho24000\d$\inetpub\www\wapps.bidvestfm.co.za\VENDORS\BFMFIN_DEV /e /y
echo
echo Done!