Use username-anarchy to create a list of usernames from known names
#### Single Username:

```bash
garffff@garffff:~$ username-anarchy John Smith > john_smith_usernames.txt
garffff@garffff:~$ cat john_smith_usernames.txt
john
johnsmith
john.smith
johnsmit
johns
j.smith
jsmith
sjohn
s.john
smithj
smith
smith.j
smith.john
js
```
#### List of Usernames:

```bash
garffff@garffff:~$ username-anarchy --input-file ./test-names.txt > outfile.txt
```
#### Usernames Known Format:

```bash
garffff@garffff:~$ username-anarchy --input-file ./test-names.txt  --select-format first.last > outfile.txt
```



