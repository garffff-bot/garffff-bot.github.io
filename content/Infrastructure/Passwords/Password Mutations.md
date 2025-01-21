### Rule-based Wordlist

```bash
hashcat --force password.list -r custom.rule --stdout | sort -u > mut_password.list
```

### Generating Wordlists Using CeWL

```bash
cewl https://www.inlanefreight.com -d 4 -m 6 --lowercase -w inlane.wordlist
```


