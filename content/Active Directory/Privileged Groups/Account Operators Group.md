**Account Operators** is a built-in group in Active Directory environments that allows members to manage user and group accounts. Members can create, modify, and delete accounts but have restricted administrative rights.

```bash
net user {NewUser} {password} /domain /add
net group "EXCHANGE WINDOWS PERMISSIONS" {NewUser} /add /domain
```


