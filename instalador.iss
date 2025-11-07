; ------------------------------
; setup-snapcommit.iss
; ------------------------------

[Setup]
AppName=GitBotCommit
AppVersion=1.0
DefaultDirName={pf}\GitBotCommit
DefaultGroupName=GitBotCommit
OutputBaseFilename=setup-GitbotCommit
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Tasks]
Name: desktopicon; Description: "Criar atalho na área de trabalho"; GroupDescription: "Atalhos adicionais:"; Flags: unchecked

[Files]
Source: "D:\JOB\Pessoais\SnapCommit\dist\gitbot.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\GitbotCommit"; Filename: "{app}\gitbot.exe"
Name: "{autodesktop}\GitbotCommit"; Filename: "{app}\gitbot.exe"; Tasks: desktopicon

[Registry]
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueName: "Path"; \
    ValueType: expandsz; \
    ValueData: "{olddata};{app}"; \
    Flags: preservestringtype uninsdeletevalue

[Run]
Filename: "{cmd}"; \
Parameters: "/C setx /M PATH ""%PATH%;{app}"""; \
StatusMsg: "Atualizando o PATH do sistema..."; \
Flags: runhidden
