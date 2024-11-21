Use username-anarchy to create a list of usernames from known names
#### Single Username:

```bash
garffff@garffff:~$ username-anarchy Jane Smith > jane_smith_usernames.txt
garffff@garffff:~$ cat jane_smith_usernames.txt 
jane
janesmith
jane.smith
janesmit
janes
j.smith
jsmith
sjane
s.jane
smithj
smith
smith.j
smith.jane
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



