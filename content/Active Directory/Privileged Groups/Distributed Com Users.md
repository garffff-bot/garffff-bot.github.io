**Distributed COM Users** is a security group in Active Directory environments that grants members the ability to launch, activate, and use Distributed Component Object Model (DCOM) applications on a server. It works by giving these users permission to remotely execute code and manage DCOM objects on the network.

```bash
dcomexec.py -object MMC20 'domain.local/user:password@x.x.x.x' 'powershell ping x.x.x.x' -nooutput
```

