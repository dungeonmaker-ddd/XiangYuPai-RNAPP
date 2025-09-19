# PowerShell 脚本：生成项目目录树结构
# 使用方法: .\generate-tree.ps1

# 生成目录树并过滤掉过深的嵌套层级（超过5级）
tree /A | findstr /v /r /c:"^|   |   |   |   |   " > tree.txt

# 读取生成的文件内容
$content = Get-Content tree.txt

# 在内容前面添加标题信息
$header = @"
---
alwaysApply: true
---
"@

# 将标题和内容合并
$finalContent = $header + "`r`n" + ($content -join "`r`n")

# 写入最终文件
$finalContent | Out-File -FilePath tree.txt -Encoding UTF8

Write-Host "目录树已生成到 tree.txt 文件中" -ForegroundColor Green
Write-Host "已过滤掉超过5级的深层嵌套目录" -ForegroundColor Yellow
