Slow and noisy:

```bash
./kerbrute_linux_amd64 userenum --dc dc01.manager.htb -d manager.htb /opt/kerberos_enum_userlists/A-Z.Surnames.txt
```

Quick and not noisy:

```bash
ldapnomnom -input users.txt -server x.x.x.x
```