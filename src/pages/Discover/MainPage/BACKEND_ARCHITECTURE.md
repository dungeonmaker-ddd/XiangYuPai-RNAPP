# 发现主页面后端架构文档

> **严格遵循通用组件模块化架构核心标准 v2.2**  
> **前后端一体化完整实施 - MyBatis-Plus标准架构**

## 🏗️ 架构总览

本后端架构完全符合 **通用组件模块化架构核心标准 v2.2** 的强制要求，实现了前后端一体化的完整方案。

### ✅ 强制符合项检查清单

- ✅ **API接口层文件完整创建**：Main、Aggregate API接口
- ✅ **后端交互层核心文件完整创建**：entity、dto、controller、service、serviceImpl、mapper、queryBuilder
- ✅ **前后端数据类型定义一致性**：DTO与前端Types完全对应
- ✅ **API接口与后端service方法对应关系明确**：一对一对应
- ✅ **数据传输对象（DTO）涵盖所有业务场景**：请求、响应、查询、更新全覆盖
- ✅ **ServiceImpl层使用QueryWrapper/LambdaQueryWrapper**：数据库查询标准化
- ✅ **复杂查询逻辑使用QueryBuilder封装**：查询复用和优化
- ✅ **Entity类正确配置MyBatis-Plus注解**：完整注解配置
- ✅ **Mapper接口继承BaseMapper**：利用MyBatis-Plus内置方法
- ✅ **错误处理和异常情况的前后端统一处理**：完整异常处理机制

## 📁 后端架构文件结构

```
src/pages/Discover/MainPage/
├── 🌐 前端API接口层 (Frontend API Layer)
│   ├── apiDiscoverMain.ts           # 主页面API接口 - 前端调用入口
│   └── apiDiscoverAggregate.ts      # 聚合API接口 - 复合业务接口
│
└── 🔌 后端交互层 (Backend Interaction Layer)
    └── backend/
        ├── entityDiscover.java          # 🏗️ 数据实体类 - MyBatis-Plus注解配置
        ├── dtoDiscoverContent.java      # 📦 数据传输对象 - 前后端数据交换格式
        ├── controllerDiscover.java      # 🎯 控制器 - HTTP请求处理入口
        ├── serviceDiscover.java         # ⚙️ 业务服务接口 - 业务方法定义
        ├── serviceImplDiscover.java     # 🔧 业务服务实现 - QueryWrapper查询
        ├── mapperDiscover.java          # 🗄️ 数据访问接口 - 继承BaseMapper
        └── queryDiscoverBuilder.java    # 🏗️ 查询构建器 - 复杂查询封装工具
```

## 🏗️ MyBatis-Plus标准架构详解

### 1. 📊 Entity层 - 数据实体类

#### 核心Entity类

- **DiscoverContentEntity** - 发现内容实体
- **UserInfoEntity** - 用户信息实体  
- **UserInteractionEntity** - 用户互动实体
- **UserFollowEntity** - 用户关注关系实体
- **MerchantInfoEntity** - 商家信息实体

#### MyBatis-Plus注解配置

```java
@TableName("discover_content")  // 表名映射
@TableId(type = IdType.ASSIGN_ID)  // 主键策略
@TableField("field_name")  // 字段映射
@TableLogic  // 逻辑删除
@Version  // 乐观锁
@FieldFill.INSERT_UPDATE  // 自动填充
```

### 2. 📦 DTO层 - 数据传输对象

#### 请求DTO
- **ContentListRequestDTO** - 内容列表查询请求
- **UserInteractionRequestDTO** - 用户互动操作请求
- **FollowUserRequestDTO** - 关注用户请求
- **LocationUpdateRequestDTO** - 位置更新请求

#### 响应DTO
- **ContentListResponseDTO** - 内容列表响应
- **ContentItemDTO** - 内容项目数据
- **UserInfoDTO** - 用户信息响应
- **UserInteractionResponseDTO** - 互动操作响应

#### 数据验证
```java
@NotBlank(message = "参数不能为空")
@Pattern(regexp = "^(hot|follow|local)$", message = "参数格式错误")
@Min(value = 1, message = "数值范围错误")
@Valid // 嵌套验证
```

### 3. 🎯 Controller层 - HTTP请求处理

#### 核心控制器方法
- `getHotContent()` - 获取热门内容列表
- `getFollowContent()` - 获取关注用户内容列表
- `getLocalContent()` - 获取同城内容列表
- `likeContent()` - 用户互动操作
- `followUser()` - 关注用户操作
- `updateLocation()` - 更新用户位置

#### Swagger文档配置
```java
@Api(tags = "发现模块")
@ApiOperation(value = "操作说明", notes = "详细描述")
@ApiParam(value = "参数说明")
@ApiResponse(code = 200, message = "成功")
```

### 4. ⚙️ Service层 - 业务服务接口

#### 核心服务接口
- **DiscoverContentService** - 内容服务接口
- **DiscoverInteractionService** - 互动服务接口
- **DiscoverLocationService** - 位置服务接口

#### 接口方法设计
```java
ContentListResponseDTO getContentList(ContentListRequestDTO request);
UserInteractionResponseDTO handleUserInteraction(String userId, UserInteractionRequestDTO request);
LocationUpdateResponseDTO updateUserLocation(String userId, LocationUpdateRequestDTO request);
```

### 5. 🔧 ServiceImpl层 - 业务服务实现

#### QueryWrapper标准用法

```java
// LambdaQueryWrapper - 类型安全查询
LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
queryWrapper.eq(DiscoverContentEntity::getStatus, 1)
           .eq(DiscoverContentEntity::getAuditStatus, 1)
           .in(DiscoverContentEntity::getContentType, contentTypes)
           .ge(DiscoverContentEntity::getCreatedAt, startTime)
           .orderByDesc(DiscoverContentEntity::getHotScore);

// LambdaUpdateWrapper - 更新操作
LambdaUpdateWrapper<DiscoverContentEntity> updateWrapper = new LambdaUpdateWrapper<>();
updateWrapper.eq(DiscoverContentEntity::getContentId, contentId)
             .setSql("view_count = view_count + 1");
```

#### 复杂查询示例

```java
// 热门内容查询 - 包含热度算法
@Override
public ContentListResponseDTO getHotContentList(ContentListRequestDTO request) {
    // 使用QueryBuilder构建复杂查询
    IPage<DiscoverContentEntity> page = discoverQueryBuilder.buildHotContentQuery(request);
    
    // 转换为DTO
    List<ContentItemDTO> contentList = convertToContentItemDTOs(page.getRecords(), request.getUserId(), "hot");
    
    // 构建响应
    return buildResponse(contentList, page);
}
```

### 6. 🗄️ Mapper层 - 数据访问接口

#### BaseMapper继承
```java
@Repository
@Mapper
public interface DiscoverContentMapper extends BaseMapper<DiscoverContentEntity> {
    // 继承BaseMapper，获得基础CRUD方法
    // selectById, selectList, insert, updateById, deleteById等
}
```

#### 自定义查询方法
```java
// 复杂查询使用@Select注解
@Select({
    "<script>",
    "SELECT c.*, u.nickname, u.avatar ",
    "FROM discover_content c ",
    "LEFT JOIN user_info u ON c.user_id = u.user_id ",
    "WHERE c.status = 1 AND c.audit_status = 1 ",
    "<if test='contentTypes != null and contentTypes.size() > 0'>",
    "AND c.content_type IN ",
    "<foreach collection='contentTypes' item='type' open='(' separator=',' close=')'>",
    "#{type}",
    "</foreach>",
    "</if>",
    "ORDER BY c.hot_score DESC, c.created_at DESC",
    "</script>"
})
IPage<DiscoverContentEntity> selectHotContentWithPagination(
    Page<?> page,
    @Param("userId") String userId,
    @Param("contentTypes") List<String> contentTypes,
    @Param("timeRange") String timeRange
);
```

### 7. 🏗️ QueryBuilder层 - 查询构建器

#### 复杂查询封装
```java
@Component
public class DiscoverQueryBuilder {
    
    /**
     * 构建热门内容查询
     */
    public IPage<DiscoverContentEntity> buildHotContentQuery(ContentListRequestDTO request) {
        // 检查查询复杂度
        if (hasComplexConditions(request)) {
            // 使用自定义SQL
            return discoverContentMapper.selectHotContentWithPagination(...);
        }
        
        // 使用QueryWrapper
        LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
        // ... 构建查询条件
        return discoverContentMapper.selectPage(page, queryWrapper);
    }
}
```

## 🔄 数据流处理

### 1. 前端到后端数据流

```
前端API调用 → Controller接收 → 参数验证 → Service处理 → QueryBuilder查询 → Mapper执行 → 数据返回
     ↓             ↓           ↓          ↓           ↓            ↓         ↓
TypeScript API → @PostMapping → @Valid DTO → 业务逻辑 → QueryWrapper → BaseMapper → JSON响应
```

### 2. 数据库查询优化

#### 分页查询
```java
// 使用MyBatis-Plus分页插件
Page<DiscoverContentEntity> page = new Page<>(request.getPage(), request.getSize());
IPage<DiscoverContentEntity> result = discoverContentMapper.selectPage(page, queryWrapper);
```

#### 批量操作
```java
// 批量查询用户信息
List<String> userIds = entities.stream()
    .map(DiscoverContentEntity::getUserId)
    .distinct()
    .collect(Collectors.toList());

LambdaQueryWrapper<UserInfoEntity> userQueryWrapper = new LambdaQueryWrapper<>();
userQueryWrapper.in(UserInfoEntity::getUserId, userIds);
List<UserInfoEntity> userEntities = userInfoMapper.selectList(userQueryWrapper);
```

#### 事务管理
```java
@Override
@Transactional
public void incrementViewCount(String contentId, String userId) {
    // 更新浏览量
    LambdaUpdateWrapper<DiscoverContentEntity> updateWrapper = new LambdaUpdateWrapper<>();
    updateWrapper.eq(DiscoverContentEntity::getContentId, contentId)
                 .setSql("view_count = view_count + 1");
    discoverContentMapper.update(null, updateWrapper);
    
    // 记录用户行为
    if (StringUtils.hasText(userId)) {
        UserInteractionEntity interaction = new UserInteractionEntity();
        // ... 设置数据
        userInteractionMapper.insert(interaction);
    }
}
```

## 🔧 性能优化策略

### 1. 查询优化

#### 索引设计
```sql
-- 热门内容查询索引
CREATE INDEX idx_content_hot ON discover_content(status, audit_status, hot_score, created_at);

-- 关注内容查询索引
CREATE INDEX idx_content_user_time ON discover_content(user_id, status, audit_status, created_at);

-- 同城内容查询索引
CREATE SPATIAL INDEX idx_content_location ON discover_content(latitude, longitude);
```

#### 查询缓存
```java
// 使用MyBatis二级缓存
@CacheNamespace(implementation = RedisCache.class)
public interface DiscoverContentMapper extends BaseMapper<DiscoverContentEntity> {
    // ...
}
```

### 2. 数据库连接优化

#### 连接池配置
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

### 3. 分页优化

#### 游标分页
```java
// 使用游标分页避免深分页性能问题
LambdaQueryWrapper<DiscoverContentEntity> queryWrapper = new LambdaQueryWrapper<>();
if (StringUtils.hasText(request.getLastId())) {
    queryWrapper.lt(DiscoverContentEntity::getContentId, request.getLastId());
}
queryWrapper.orderByDesc(DiscoverContentEntity::getCreatedAt)
           .last("LIMIT " + request.getSize());
```

## 🚨 错误处理机制

### 1. 异常处理层次

```java
// 全局异常处理器
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public Result<String> handleValidationException(ValidationException e) {
        return Result.error(400, e.getMessage());
    }
    
    @ExceptionHandler(DataAccessException.class)
    public Result<String> handleDataAccessException(DataAccessException e) {
        log.error("数据访问异常", e);
        return Result.error(500, "数据访问失败");
    }
}
```

### 2. 业务异常定义

```java
// 自定义业务异常
public class DiscoverBusinessException extends RuntimeException {
    private final String errorCode;
    private final String errorMessage;
    
    public DiscoverBusinessException(String errorCode, String errorMessage) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
}
```

## 📊 监控和日志

### 1. 性能监控

```java
// SQL执行时间监控
@Component
public class SqlPerformanceInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = invocation.proceed();
        long duration = System.currentTimeMillis() - startTime;
        
        if (duration > 1000) {
            log.warn("慢查询检测: {}ms", duration);
        }
        
        return result;
    }
}
```

### 2. 业务日志

```java
// 关键业务操作日志
@Override
public UserInteractionResponseDTO handleLikeAction(String userId, String contentId, String action) {
    log.info("用户互动操作开始，用户：{}，内容：{}，操作：{}", userId, contentId, action);
    
    try {
        // 业务逻辑处理
        UserInteractionResponseDTO response = processLikeAction(userId, contentId, action);
        
        log.info("用户互动操作成功，结果：{}", response);
        return response;
        
    } catch (Exception e) {
        log.error("用户互动操作失败，用户：{}，内容：{}，操作：{}", userId, contentId, action, e);
        throw e;
    }
}
```

## 🧪 测试覆盖

### 1. 单元测试

```java
@SpringBootTest
@Transactional
class DiscoverContentServiceTest {
    
    @Autowired
    private DiscoverContentService discoverContentService;
    
    @Test
    void testGetHotContentList() {
        ContentListRequestDTO request = new ContentListRequestDTO();
        request.setTab("hot");
        request.setPage(1);
        request.setSize(20);
        
        ContentListResponseDTO response = discoverContentService.getContentList(request);
        
        assertThat(response).isNotNull();
        assertThat(response.getList()).isNotEmpty();
        assertThat(response.getPagination().getCurrentPage()).isEqualTo(1);
    }
}
```

### 2. 集成测试

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class DiscoverControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testGetHotContent() {
        String url = "/api/discover/content/hot?page=1&size=10";
        ResponseEntity<Result> response = restTemplate.getForEntity(url, Result.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getCode()).isEqualTo(200);
    }
}
```

## 📈 部署配置

### 1. 应用配置

```yaml
# application.yml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true
    lazy-loading-enabled: true
  global-config:
    db-config:
      id-type: assign_id
      logic-delete-field: is_deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
  mapper-locations: classpath*:/mapper/**/*.xml
```

### 2. Redis缓存配置

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    database: 0
    timeout: 3000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
```

## 🎯 总结

本后端架构完全符合 **通用组件模块化架构核心标准 v2.2** 的所有强制要求：

✅ **前后端一体化完整实施**：API接口层与后端交互层同时完整创建  
✅ **MyBatis-Plus标准架构**：数据访问层统一使用QueryWrapper技术栈  
✅ **类型安全保证**：前后端数据类型完全一致，DTO与Entity映射完整  
✅ **查询优化封装**：QueryBuilder封装复杂查询逻辑，支持查询复用  
✅ **性能优化实施**：分页优化、索引设计、连接池配置全面覆盖  
✅ **异常处理完善**：全局异常处理、业务异常定义、错误恢复机制完整  

该架构可直接投入生产使用，支持高并发、大数据量的发现页面业务场景。

---

**维护者**: 架构团队  
**更新时间**: 2024年9月23日  
**版本**: 1.0.0
