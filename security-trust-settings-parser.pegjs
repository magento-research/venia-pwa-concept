CertList
  = count:CertCount certs:Cert* { return { count, certs }; }
CertCount
  = "Number of trusted certs = " n:integer EOS { return n; }
Cert
  = "Cert " integer ": " domain:ROL
    count:SettingCount
    settings:TrustSetting* { return { domain, count, settings }; }
SettingCount
  = indent "Number of trust settings : " n:integer EOL { return n; }
TrustSetting
  = SettingNumber properties: Property* {
    return Object.assign.apply(Object, properties)
  }
SettingNumber
 = indent "Trust Setting " integer ":" EOL
Property
 = indent indent name:PropertyName value:ROL { return { [name]: value } }
PropertyName
 = t:$[^:]+ space* ":" space { return t.trim(); }
ROL = n:$ [^\n]+ EOL { return n; }
integer
 = digits:$[0-9]+ { return parseInt(digits, 10); }
space
 = " "
indent
 = space space space
EOL = "\n"
EOS = EOL / EOF
EOF = !.