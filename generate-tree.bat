@echo off
REM 批处理脚本：生成src目录树结构
REM 使用方法: generate-tree.bat

echo 正在生成src目录树...

REM 生成src目录树（包含文件）并过滤掉过深的嵌套层级（超过3级）和.md文件
tree src /A /F | findstr /v /r /c:"^|   |   |   |   " | findstr /v /r /c:"\.md$" > temp_tree.txt

REM 创建带标题的最终文件
echo --- > ".cursor\rules\project.mdc"
echo alwaysApply: true >> ".cursor\rules\project.mdc"
echo --- >> ".cursor\rules\project.mdc"
type temp_tree.txt >> ".cursor\rules\project.mdc"

REM 删除临时文件
del temp_tree.txt

echo 目录树已生成到 .cursor\rules\project.mdc 文件中
echo 已过滤掉超过5级的深层嵌套目录
pause
