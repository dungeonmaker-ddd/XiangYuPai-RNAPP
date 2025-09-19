@echo off
REM 批处理脚本：生成项目目录树结构
REM 使用方法: generate-tree.bat

echo 正在生成目录树...

REM 生成目录树并过滤掉过深的嵌套层级（超过5级）
tree /A | findstr /v /r /c:"^|   |   |   |   |   " > temp_tree.txt

REM 创建带标题的最终文件
echo 文件夹 PATH 列表 > tree.txt
echo 卷序列号为 64C1-D356 >> tree.txt
type temp_tree.txt >> tree.txt

REM 删除临时文件
del temp_tree.txt

echo 目录树已生成到 tree.txt 文件中
echo 已过滤掉超过5级的深层嵌套目录
pause
