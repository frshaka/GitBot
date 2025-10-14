; ------------------------------
; setup-snapcommit.iss
; ------------------------------

[Setup]
AppName=SnapCommit
AppVersion=1.0
DefaultDirName={pf}\SnapCommit
DefaultGroupName=SnapCommit
OutputBaseFilename=setup-snapcommit
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Tasks]
Name: desktopicon; Description: "Criar atalho na área de trabalho"; GroupDescription: "Atalhos adicionais:"; Flags: unchecked

[Files]
Source: "D:\JOB\Pessoais\SnapCommit\dist\snap.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\SnapCommit"; Filename: "{app}\snap.exe"
Name: "{autodesktop}\SnapCommit"; Filename: "{app}\snap.exe"; Tasks: desktopicon

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
