
@echo off
echo Compiling...
cmd /c "ng build"
echo Clearing target directory
rmdir /s/q \\ho24000\d$\inetpub\www\wapps.bidvestfm.co.za\VENDORS\BFMFIN
mkdir \\ho24000\d$\inetpub\www\wapps.bidvestfm.co.za\VENDORS\BFMFIN
echo Copying compiled code to target directory
xcopy .\dist\baseapp\browser\* \\ho24000\d$\inetpub\www\wapps.bidvestfm.co.za\VENDORS\BFMFIN /e /y
echo
echo Done!