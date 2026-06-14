Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$srcPath = Join-Path $root 'src\main\java'
$binPath = Join-Path $root 'bin'

if (Test-Path $binPath) {
    Remove-Item $binPath -Recurse -Force
}
New-Item -ItemType Directory -Path $binPath | Out-Null

$sources = Get-ChildItem -Path $srcPath -Recurse -Filter '*.java' |
    ForEach-Object { $_.FullName }

if (-not $sources) {
    throw 'No se encontraron archivos .java en src.'
}

& javac -encoding UTF-8 --release 17 -d $binPath $sources
& java -cp $binPath com.bocatto.Main
