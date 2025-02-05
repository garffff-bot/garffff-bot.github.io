Pipes are used for communication between two applications or processes using shared memory. Two types of pipes:

- **Named Pipes**  
    Used for communication between **unrelated processes**, even across a network.  
    Example: `\\.\pipe\SQLLocal\SQLEXPRESS01`
    
- **Anonymous Pipes**  
    Used for communication between a **parent and child process** on the same machine. They are temporary and exist only while the processes are running.
#### List Named Pipes

CMD:

```bash
pipelist.exe /accepteula
```

Powershell:

```powershell-session
gci \\.\pipe\
```

Check Permissions:

```bash
accesschk.exe -accepteula -w \pipe\SQLLocal\SQLEXPRESS01 -v
```

The following means authenticated users:

```bash
  RW Everyone
        FILE_ALL_ACCESS
```

