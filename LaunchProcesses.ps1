$scriptPath = $MyInvocation.MyCommand.Path
$rootPath = (Split-Path (Split-Path $scriptPath -Parent) -Parent)
$webAppPath = $rootPath + "\src\LDC.Atlas.WebApp"
$processorPath = $rootPath + "\src\LDC.Atlas.Services.Processor"

$angularCmd = "ng"
$angularParams = "build --watch"

$processorCmd = "dotnet"
$accountingProcessParams = 'run --launch-profile "LDC.Atlas.Services.Processor" --server.urls "http://localhost:7030" --BackgroundTask:ProcessType=AtlasAccountingDocumentProcessor'
$postingProcessParams = 'run --launch-profile "LDC.Atlas.Services.Processor" --server.urls "http://localhost:7031" --BackgroundTask:ProcessType=AtlasPostingProcessor'

#Accounting
Start-Process -WorkingDirectory $processorPath -FilePath $processorCmd -ArgumentList $accountingProcessParams
Start-Sleep -Seconds 5

#Angular
Start-Process -WorkingDirectory $webAppPath -FilePath $angularCmd -ArgumentList $angularParams
Start-Sleep -Seconds 5

#Posting
Start-Process -WorkingDirectory $processorPath -FilePath $processorCmd -ArgumentList $postingProcessParams